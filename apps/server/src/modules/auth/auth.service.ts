import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import type { Request, Response } from 'express'
import { comparePasswords } from 'src/common/utils'
import { pick } from 'radash'
import {
  CreateUserDto,
  IUser,
  UserPublicKeys,
} from '../user/dto'
import { UserService } from '../user/user.service'
import { MailService } from '../mail/mail.service'
import { JWTokenService } from '../token/jwtoken.service'
import { TokenService } from '../token/token.service'
import { LoginRequestDto } from './dto'
import { ISendOTPResult } from './dto/otp.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtokenService: JWTokenService,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Get current authenticated user
   * @param {Request} req - Request object
   * @param {Response} _res - Response object
   * @returns {Promise<IUserTokenPayload>} User object
   */
  async getCurrentUser(req: Request, _res: Response): Promise<IUser | null> {
    return this.jwtokenService.validateJwt(req)
  }

  async login(dto: LoginRequestDto): Promise<IUser> {
    const user = await this.validateUser(dto)
    // Return user with tokens
    return this.getLoginResponseData(user)
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

  async sendOTP(email: string): Promise<ISendOTPResult> {
    return this.mailService.sendOTP(email)
  }

  async loginWithOTP(email: string, code: string): Promise<IUser> {
    const isCodeValid = this.tokenService.verify({
      owner: email,
      code,
    })
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid verification code')
    }

    const user = await this.userService.findByEmailX(email)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    return this.getLoginResponseData(user)
  }

  private async getLoginResponseData(user: IUser): Promise<IUser> {
    const tokens = await this.jwtokenService.generateTokens(user)

    return {
      ...pick(user, UserPublicKeys),
      ...tokens,
      resources: user.resources,
    }
  }
}
