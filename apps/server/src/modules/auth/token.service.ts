import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { isEmpty, omit } from 'radash'
import type { Request } from 'express'
import type { IUser, IUserToken, IUserTokenPayload } from '@nextboard/common'
import { UserService } from '../user/user.service'
import { RefreshTokenRequestDto } from '../auth/dto'
import { AppConfigService } from '../config/config.service'

@Injectable()
export class TokenService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
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
    const [type, token] = authHeader.split(' ') ?? []
    if (isEmpty(token) || type !== 'Bearer') {
      throw new UnauthorizedException('Unauthorized')
    }

    const secret = isRefreshToken ? this.getJwtRefreshSecret() : this.getJwtSecret()

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

    return req.user
  }

  async refreshToken(dto: RefreshTokenRequestDto): Promise<IUserToken> {
    const secret = this.getJwtRefreshSecret()
    const payload: IUserTokenPayload = await this.jwtService.verifyAsync(dto.refreshToken, {
      secret,
    })

    const user = await this.userService.findByEmail(payload.username)
    if (!user) {
      throw new NotFoundException('User not found')
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

    return {
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
