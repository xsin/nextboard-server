import type { Request, Response } from 'express'
import { comparePasswords } from '@/common/utils'
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import {
  type ISendEmailResult,
  type IUser,
  IUserToken,
  XBError,
  TAccountProvider,
  TAccountType,
} from '@xsin/xboard'
import { pick } from 'radash'
import { CreateAccountDto } from '../account/dto/create.dto'
import { MailService } from '../mail/mail.service'
import {
  CreateUserDto,
} from '../user/dto/create.dto'
import { UserPublicKeys } from '../user/dto/user.dto'
import { UserService } from '../user/user.service'
import { VCodeService } from '../vcode/vcode.service'
import { LoginRequestDto, RefreshTokenRequestDto } from './dto/login.dto'
import { TokenService } from './token.service'

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
    await this.userService.updateAccount(TAccountProvider.localPwd, user1.email, {
      accessToken: user1.accessToken,
      refreshToken: user1.refreshToken,
      expiredAt: user1.accessTokenExpiredAt,
      refreshExpiredAt: user1.refreshTokenExpiredAt,
    })

    return user1
  }

  async refreshToken(dto: RefreshTokenRequestDto): Promise<IUserToken> {
    const tokens = await this.tokenService.refreshToken(dto)
    // Update the Account record with the latest tokens
    await this.userService.updateAccount(dto.provider, dto.username, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiredAt: tokens.accessTokenExpiredAt,
      refreshExpiredAt: tokens.refreshTokenExpiredAt,
    })
    return tokens
  }

  private async validateUser(dto: LoginRequestDto): Promise<IUser> {
    const user = await this.userService.findByEmailX(dto.username)
    if (!user) {
      throw new NotFoundException(XBError.NOT_FOUND)
    }

    // Check email's verification status
    if (!user.emailVerifiedAt) {
      throw new UnauthorizedException(XBError.AUTH_UNVERIFIED_EMAIL)
    }

    const isValid = await comparePasswords(dto.password, user.password)
    if (!isValid) {
      throw new UnauthorizedException(XBError.AUTH_INVALID_PWD)
    }

    return user
  }

  async signUp(dto: CreateUserDto): Promise<IUser> {
    const createAccountDto: CreateAccountDto = {
      type: TAccountType.local,
      provider: TAccountProvider.localPwd,
      providerAccountId: dto.email,
      accessToken: null,
      refreshToken: null,
      expiredAt: null,
      refreshExpiredAt: null,
      tokenType: null,
      scope: null,
      idToken: null,
      sessionState: null,
    }

    // Find the user and check if the email is already verified
    let user = await this.userService.findByEmail(dto.email)
    if (user && !user.emailVerifiedAt) {
      // Resend verification email
      await this.mailService.sendVerificationEmail(dto.email)
      return user
    }

    user = await this.userService.create(dto, createAccountDto)
    // Send verification email
    await this.mailService.sendVerificationEmail(user.email)
    return user
  }

  async sendOTP(email: string): Promise<ISendEmailResult> {
    return this.mailService.sendOTP(email)
  }

  async loginWithOTP(email: string, code: string): Promise<IUser> {
    const isCodeValid = await this.vcodeService.verify({
      owner: email,
      code,
    })
    if (!isCodeValid) {
      throw new UnauthorizedException(XBError.AUTH_INVALID_OTP)
    }

    let user = await this.userService.findByEmailX(email)
    if (!user) {
      // create a new user with a otp account
      const createAccountDto: CreateAccountDto = {
        type: TAccountType.local,
        provider: TAccountProvider.localOtp,
        providerAccountId: email,
        accessToken: null,
        refreshToken: null,
        expiredAt: null,
        refreshExpiredAt: null,
        tokenType: null,
        scope: null,
        idToken: null,
        sessionState: null,
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
    await this.userService.updateAccount(TAccountProvider.localOtp, user1.email, {
      accessToken: user1.accessToken,
      refreshToken: user1.refreshToken,
      expiredAt: user1.accessTokenExpiredAt,
      refreshExpiredAt: user1.refreshTokenExpiredAt,
    })

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
}
