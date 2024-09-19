import type { Request } from 'express'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { type IUser, IUserFull, type IUserToken, type IUserTokenPayload, NBError } from '@nextboard/common'
import { isEmpty, omit } from 'radash'
import { AppConfigService } from '../config/config.service'
import { UserService } from '../user/user.service'
import { RefreshTokenRequestDto } from './dto/login.dto'

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Validate JWT token
   * @param {Request} req - Request object
   * @param {boolean} isRefreshToken - Whether is refreshing token
   * @returns {Promise<IUser>} User object
   */
  async validateJwt(req: Request, isRefreshToken?: boolean): Promise<IUser> {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized')
    }
    const [type, token] = authHeader.split(' ')
    if (isEmpty(token) || type !== 'Bearer') {
      throw new UnauthorizedException('Unauthorized')
    }

    const userFromDb = await this.parseUserFrowJwt(token, isRefreshToken)
    if (!userFromDb) {
      throw new NotFoundException(NBError.NOT_FOUND)
    }
    // Save the user object to the request object
    req.user = omit(userFromDb, ['password'])

    return req.user
  }

  /**
   * Parse user from JWT token
   * @param {string} token - JWT token
   * @param {boolean} isRefreshToken - Whether is refreshing token
   * @returns {Promise<IUser>} User object
   */
  async parseUserFrowJwt(token: string, isRefreshToken?: boolean): Promise<IUserFull> {
    const secret = isRefreshToken ? this.getJwtRefreshSecret() : this.getJwtSecret()
    const payload: IUserTokenPayload = await this.jwtService.verifyAsync(token, {
      secret,
    })
    // Check cache first
    const cacheKey = this.userService.getItemCacheKey(payload.sub, 'jwt')
    let user = await this.cacheManager.get<IUserFull>(cacheKey)
    if (!user) {
      user = await this.userService.findByIdX(payload.sub, false)
      if (user) {
        // Cache user information
        await this.cacheManager.set(cacheKey, user, this.configService.NB_REDIS_TTL_JWT_USER * 1000)
      }
    }
    return user
  }

  async refreshToken(dto: RefreshTokenRequestDto): Promise<IUserToken> {
    const secret = this.getJwtRefreshSecret()
    const payload: IUserTokenPayload = await this.jwtService.verifyAsync(dto.refreshToken, {
      secret,
    })

    const user = await this.userService.findByEmail(payload.username)
    if (!user) {
      throw new NotFoundException(NBError.NOT_FOUND)
    }

    return this.generateTokens(user)
  }

  async generateTokens(user: IUser): Promise<IUserToken> {
    const payload: IUserTokenPayload = {
      iss: 'NextBoard',
      username: user.email,
      sub: user.id,
    }
    const jwtSecret = this.getJwtSecret()
    const jwtRefreshSecret = this.getJwtRefreshSecret()

    // Token expiry time in seconds
    const expiresIn1 = this.configService.JWT_EXPIRY
    const expiresIn2 = this.configService.JWT_REFRESH_EXPIRY

    // Calculate absolute expiry time
    const expiredAt1 = new Date(Date.now() + expiresIn1 * 1000)
    const expiredAt2 = new Date(Date.now() + expiresIn2 * 1000)

    const tokens = {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: expiresIn1,
        secret: jwtSecret,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: expiresIn2,
        secret: jwtRefreshSecret,
      }),
      accessTokenExpiredAt: expiredAt1,
      refreshTokenExpiredAt: expiredAt2,
    }
    return tokens
  }

  private getJwtSecret(): string {
    let jwtSecret = this.configService.JWT_SECRET
    jwtSecret = !isEmpty(jwtSecret) ? jwtSecret : 'NextBoard'
    return jwtSecret
  }

  private getJwtRefreshSecret(): string {
    let jwtRefreshSecret = this.configService.JWT_REFRESH_SECRET
    jwtRefreshSecret = !isEmpty(jwtRefreshSecret) ? jwtRefreshSecret : this.getJwtSecret()
    return jwtRefreshSecret
  }
}
