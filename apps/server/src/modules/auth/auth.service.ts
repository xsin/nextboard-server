import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import type { Request, Response } from 'express'
import { comparePasswords } from 'src/common/utils'
import { pick } from 'radash'
import { TAccountProvider, TAccountType } from '@prisma/client'
import {
  CreateUserDto,
  IUser,
  UserPublicKeys,
} from '../user/dto'
import { UserService } from '../user/user.service'
import { MailService } from '../mail/mail.service'
import { VCodeService } from '../vcode/vcode.service'
import { UpdateAccountDto } from '../account/dto/update-account.dto'
import { CreateAccountDto } from '../account/dto/create-account.dto'
import { TokenService } from './token.service'
import { LoginRequestDto } from './dto'
import { ISendOTPResult } from './dto/otp.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly vcodeService: VCodeService,
  ) {}

  /**
   * Get current authenticated user
   * @param {Request} req - Request object
   * @param {Response} _res - Response object
   * @returns {Promise<IUserTokenPayload>} User object
   */
  async getCurrentUser(req: Request, _res: Response): Promise<IUser | null> {
    return this.tokenService.validateJwt(req)
  }

  /**
   * Login with username and password
   * @param {LoginRequestDto} dto - Login request data
   * @returns {Promise<IUser>} User object
   */
  async login(dto: LoginRequestDto): Promise<IUser> {
    const user = await this.validateUser(dto)
    // Return user with tokens
    const user1 = await this.getLoginResponseData(user)
    // Update the Account record with the latest tokens
    await this.updateAccountTokens(user1, TAccountProvider.localPwd)

    return user1
  }

  private async validateUser(dto: LoginRequestDto): Promise<IUser> {
    const user = await this.userService.findByEmailX(dto.username)
    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Check email's verification status
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException('Email is not verified')
    }

    const isValid = await comparePasswords(dto.password, user.password)
    if (!isValid) {
      throw new UnauthorizedException('Invalid password')
    }

    return user
  }

  async signUp(dto: CreateUserDto): Promise<IUser> {
    const createAccountDto: CreateAccountDto = {
      type: TAccountType.local,
      provider: TAccountProvider.localPwd,
      providerAccountId: dto.email,
    }

    const user = await this.userService.create(dto, createAccountDto)
    // Send verification email
    await this.mailService.sendVerificationEmail(user.email)
    return user
  }

  async sendOTP(email: string): Promise<ISendOTPResult> {
    return this.mailService.sendOTP(email)
  }

  async loginWithOTP(email: string, code: string): Promise<IUser> {
    const isCodeValid = this.vcodeService.verify({
      owner: email,
      code,
    })
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid verification code')
    }

    let user = await this.userService.findByEmailX(email)
    if (!user) {
      // create a new user with a otp account
      const createAccountDto: CreateAccountDto = {
        type: TAccountType.local,
        provider: TAccountProvider.localOtp,
        providerAccountId: email,
      }
      await this.userService.create({
        email,
        emailVerifiedAt: new Date(),
        password: '',
        password1: '',
      }, createAccountDto)
      user = await this.userService.findByEmailX(email)
    }

    const user1 = await this.getLoginResponseData(user)

    // Update the Account record with the latest tokens
    await this.updateAccountTokens(user1, TAccountProvider.localOtp)

    return user1
  }

  private async getLoginResponseData(user: IUser): Promise<IUser> {
    const tokens = await this.tokenService.generateTokens(user)

    return {
      ...pick(user, UserPublicKeys),
      ...tokens,
      resources: user.resources,
    }
  }

  private async updateAccountTokens(user: IUser, provider: TAccountProvider): Promise<void> {
    const accountUpdateDto: UpdateAccountDto = {
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      expiredAt: user.accessTokenExpiredAt,
      refreshExpiredAt: user.refreshTokenExpiredAt,
    }
    await this.userService.updateAccount(provider, user.email, accountUpdateDto)
  }
}
