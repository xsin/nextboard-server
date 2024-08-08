import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import type { Provider } from '@auth/express/providers'
import Credentials from '@auth/express/providers/credentials'
import type { NextFunction, Request, Response } from 'express'
import { ExpressAuth, type ExpressAuthConfig, getSession } from '@auth/express'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { comparePasswords } from 'src/common/utils'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { C_AUTH_SECRET, C_JWT_EXPIRY, C_JWT_REFRESH_EXPIRY, C_JWT_REFRESH_SECRET, C_JWT_SECRET } from 'src/types'
import { isEmpty, pick } from 'radash'
import { getConfig } from 'src/common/configs'
import { PrismaService } from '../prisma/prisma.service'
import { CreateUserDto, IUserQueryDto, IUserToken, IUserTokenPayload, IUserWithTokensAndMenus, IUserX, UserQueryDtoKeys } from '../user/dto'
import { UserService } from '../user/user.service'
import { LoginRequestDto, RefreshTokenDto } from './dto'

@Injectable()
export class AuthService {
  readonly providers: Provider[]
  private readonly expressAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>
  private readonly expressAuthConfig: ExpressAuthConfig
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.providers = [
      this.credentialsProvider(this),
    ]
    this.expressAuthConfig = {
      trustHost: true,
      providers: this.providers,
      adapter: PrismaAdapter(this.prismaService),
    }
    this.expressAuth = ExpressAuth(this.expressAuthConfig)
  }

  private credentialsProvider(authService: AuthService): Provider {
    return Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _request) {
        const user = await authService.login({
          username: credentials.username as string,
          password: credentials.password as string,
        })
        return user
      },
    })
  }

  /**
   * Auth middleware, provided by @auth/express
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {NextFunction} next - Express next function
   */
  auth(req: Request, res: Response, next: NextFunction): void {
    // Routes that skip auth middleware
    const whitelist = [
      this.getAuthRoute('signup'),
      this.getAuthRoute('refresh'),
    ]
    if (whitelist.some(item => req.baseUrl.includes(item))) {
      return next()
    }

    this.expressAuth(req, res, next)
  }

  /**
   * Authenticated session middleware
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @param {NextFunction} next Next function
   */
  async authSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.locals.session = await this.retrieveSession(req, res)
    next()
  }

  /**
   * Get and update session
   * @link https://authjs.dev/getting-started/session-management/get-session
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @returns {Promise<ReturnType<typeof getSession>>} Session object
   */
  private async retrieveSession(req: Request, res: Response): Promise<ReturnType<typeof getSession>> {
    const session = res.locals.session ?? (await getSession(req, this.expressAuthConfig))
    res.locals.session = session
    return session
  }

  /**
   * Validate JWT token
   * @param {Request} req - Request object
   * @param {boolean} isRefreshToken - Whether is refreshing token
   * @returns {Promise<IUserTokenPayload>} User object
   */
  private async validateJwt(req: Request, isRefreshToken?: boolean): Promise<IUserTokenPayload> {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized')
    }
    const [type, token] = authHeader.split(' ') ?? []
    if (isEmpty(token) || type !== 'Bearer') {
      throw new UnauthorizedException('Unauthorized')
    }

    const secret = isRefreshToken ? this.getJwtRefreshSecret() : this.getJwtSecret()

    try {
      const payload: IUserTokenPayload = await this.jwtService.verifyAsync(token, {
        secret,
      })
      // Save the user object to the request object
      req.user = payload
    }
    catch {
      throw new UnauthorizedException('Unauthorized')
    }

    return req.user
  }

  /**
   * Get current user
   * @param {Request} req - Request object
   * @param {Response} res - Response object
   * @returns {Promise<IUserTokenPayload>} User object
   */
  async getCurrentUser(req: Request, res: Response): Promise<IUserTokenPayload | null> {
    const session = await this.retrieveSession(req, res)
    if (session?.user) {
      console.log('session.user', session.user)
      return session.user as IUserTokenPayload
    }
    return this.validateJwt(req)
  }

  async login(dto: LoginRequestDto): Promise<IUserWithTokensAndMenus> {
    const user = await this.validateUser(dto)
    // Return user with tokens
    const tokens = await this.generateTokens(user)

    const res: IUserWithTokensAndMenus = {
      ...pick(user, UserQueryDtoKeys),
      ...tokens,
      menus: user.menus,
    }
    return res
  }

  async refreshToken(dto: RefreshTokenDto): Promise<IUserToken> {
    try {
      const secret = this.getJwtRefreshSecret()
      const payload: IUserTokenPayload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret,
      })

      const user = await this.userService.findByEmailX(payload.username)
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return this.generateTokens(user)
    }
    catch (error) {
      throw new UnauthorizedException(`Invalid refresh token: ${error.message}`)
    }
  }

  private async generateTokens(user: IUserX): Promise<IUserToken> {
    const payload: IUserTokenPayload = {
      iss: 'NextBoard',
      username: user.email,
      sub: user.id,
      roles: user.roleNames,
      permissions: user.permissionNames,
    }
    const jwtSecret = this.getJwtSecret()
    const jwtRefreshSecret = this.getJwtRefreshSecret()

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get(C_JWT_EXPIRY),
        secret: jwtSecret,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get(C_JWT_REFRESH_EXPIRY),
        secret: jwtRefreshSecret,
      }),
    }
  }

  private getJwtSecret(): string {
    let jwtSecret = this.configService.get(C_JWT_SECRET)
    jwtSecret = !isEmpty(jwtSecret) ? jwtSecret : this.configService.get(C_AUTH_SECRET)
    return jwtSecret
  }

  private getJwtRefreshSecret(): string {
    let jwtRefreshSecret = this.configService.get(C_JWT_REFRESH_SECRET)
    jwtRefreshSecret = !isEmpty(jwtRefreshSecret) ? jwtRefreshSecret : this.getJwtSecret()
    return jwtRefreshSecret
  }

  private async validateUser(dto: LoginRequestDto): Promise<IUserX> {
    const user = await this.userService.findByEmailX(dto.username)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const isValid = await comparePasswords(dto.password, user.password)
    if (!isValid) {
      throw new UnauthorizedException('Invalid password')
    }

    return user
  }

  async signUp(dto: CreateUserDto): Promise<IUserQueryDto> {
    return this.userService.create(dto)
  }

  private getAuthRoute(actionName?: string): string {
    const apiPrefix = getConfig().public.apiPrefix
    const baseUrl = apiPrefix ? `/${apiPrefix}/auth` : '/auth'
    if (isEmpty(actionName)) {
      return baseUrl
    }
    return `${baseUrl}/${actionName}`
  }

  private isPublicRoute(baseUrl: string): boolean {
    const apiPrefix = getConfig().public.apiPrefix
    const rootUrl = apiPrefix ? `/${apiPrefix}` : '/'
    const swaggerDocUrl = apiPrefix ? `/${apiPrefix}/api-json` : '/api-json'
    const whitelist: string[] = [
      this.getAuthRoute(),
      swaggerDocUrl,
    ]
    const yes = whitelist.some(url => baseUrl.startsWith(url)) || baseUrl === rootUrl
    return yes
  }
}
