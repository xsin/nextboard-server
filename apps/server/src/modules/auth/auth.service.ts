import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import type { Request, Response } from 'express'
import { comparePasswords } from 'src/common/utils'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { C_AUTH_SECRET, C_JWT_EXPIRY, C_JWT_REFRESH_EXPIRY, C_JWT_REFRESH_SECRET, C_JWT_SECRET } from 'src/types'
import { isEmpty, omit, pick } from 'radash'
import { getConfig } from 'src/common/configs'
import {
  CreateUserDto,
  IUser,
  IUserToken,
  IUserTokenPayload,
  UserPublicKeys,
} from '../user/dto'
import { UserService } from '../user/user.service'
import { LoginRequestDto, RefreshTokenRequestDto } from './dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validate JWT token
   * @param {Request} req - Request object
   * @param {boolean} isRefreshToken - Whether is refreshing token
   * @returns {Promise<IUser>} User object
   */
  private async validateJwt(req: Request, isRefreshToken?: boolean): Promise<IUser> {
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
      // Retrieve the user object from the database
      const userFromDb = await this.userService.findByIdX(payload.sub, false)
      if (!userFromDb) {
        throw new NotFoundException('User not found')
      }
      // Save the user object to the request object
      req.user = omit(userFromDb, ['password'])
    }
    catch {
      throw new UnauthorizedException('Unauthorized')
    }

    return req.user
  }

  /**
   * Get current authenticated user
   * @param {Request} req - Request object
   * @param {Response} _res - Response object
   * @returns {Promise<IUserTokenPayload>} User object
   */
  async getCurrentUser(req: Request, _res: Response): Promise<IUser | null> {
    return this.validateJwt(req)
  }

  async login(dto: LoginRequestDto): Promise<IUser> {
    const user = await this.validateUser(dto)
    // Return user with tokens
    const tokens = await this.generateTokens(user)

    const res: IUser = {
      ...pick(user, UserPublicKeys),
      ...tokens,
      resources: user.resources,
    }
    return res
  }

  async refreshToken(dto: RefreshTokenRequestDto): Promise<IUserToken> {
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

  private async generateTokens(user: IUser): Promise<IUserToken> {
    const payload: IUserTokenPayload = {
      iss: 'NextBoard',
      username: user.email,
      sub: user.id,
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

  private async validateUser(dto: LoginRequestDto): Promise<IUser> {
    const user = await this.userService.findByEmailX(dto.username)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Check email's verification status
    if (!user.emailVerified) {
      throw new UnauthorizedException('Email is not verified')
    }

    const isValid = await comparePasswords(dto.password, user.password)
    if (!isValid) {
      throw new UnauthorizedException('Invalid password')
    }

    return user
  }

  async signUp(dto: CreateUserDto): Promise<IUser> {
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
