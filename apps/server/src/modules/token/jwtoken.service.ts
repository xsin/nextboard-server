import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { C_JWT_EXPIRY, C_JWT_REFRESH_EXPIRY, C_JWT_REFRESH_SECRET, C_JWT_SECRET } from 'src/types'
import { isEmpty, omit } from 'radash'
import { ConfigService } from '@nestjs/config'
import type { Request } from 'express'
import { UserService } from '../user/user.service'
import { IUser, IUserToken, IUserTokenPayload } from '../user/dto'
import { RefreshTokenRequestDto } from '../auth/dto'

@Injectable()
export class JWTokenService {
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

  async refreshToken(dto: RefreshTokenRequestDto): Promise<IUserToken> {
    try {
      const secret = this.getJwtRefreshSecret()
      const payload: IUserTokenPayload = await this.jwtService.verifyAsync(dto.refreshToken, {
        secret,
      })

      const user = await this.userService.findByEmail(payload.username)
      if (!user) {
        throw new UnauthorizedException('User not found')
      }

      return this.generateTokens(user)
    }
    catch (error) {
      throw new UnauthorizedException(`Invalid refresh token: ${error.message}`)
    }
  }

  async generateTokens(user: IUser): Promise<IUserToken> {
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
    jwtSecret = !isEmpty(jwtSecret) ? jwtSecret : 'NextBoard'
    return jwtSecret
  }

  private getJwtRefreshSecret(): string {
    let jwtRefreshSecret = this.configService.get(C_JWT_REFRESH_SECRET)
    jwtRefreshSecret = !isEmpty(jwtRefreshSecret) ? jwtRefreshSecret : this.getJwtSecret()
    return jwtRefreshSecret
  }
}
