import { Test, TestingModule } from '@nestjs/testing'
import { EmailType, type ISendEmailResult, TAccountProvider, TUserGender } from '@xsin/xboard'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateUserDto } from '../user/dto/create.dto'
import { UserDto, UserTokenDto } from '../user/dto/user.dto'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { LoginRequestDto, RefreshTokenRequestDto } from './dto/login.dto'
import { OTPLoginDto, SendOTPRequestDto } from './dto/otp.dto'

describe('authController', () => {
  let controller: AuthController
  let authService: AuthService

  const mockUser: UserDto = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    displayName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    emailVerifiedAt: null,
    avatar: '',
    gender: TUserGender.unknown,
    birthday: new Date(),
    online: true,
    disabled: false,
    createdBy: '1',
    updatedBy: '1',
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
    accessTokenExpiredAt: new Date(),
    refreshTokenExpiredAt: new Date(),
    loginAt: new Date(),
  }

  const mockUserToken: UserTokenDto = {
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: vi.fn(),
            login: vi.fn(),
            sendOTP: vi.fn(),
            loginWithOTP: vi.fn(),
            refreshToken: vi.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('signUp', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        password1: 'password123',
        name: 'Test User',
      }
      vi.spyOn(authService, 'signUp').mockResolvedValue(mockUser)

      const result = await controller.signUp(createUserDto)

      expect(result).toEqual(mockUser)
      expect(authService.signUp).toHaveBeenCalledWith(createUserDto)
    })
  })

  describe('refreshToken', () => {
    it('should refresh the token', async () => {
      const refreshTokenDto: RefreshTokenRequestDto = {
        refreshToken: 'oldRefreshToken',
        provider: TAccountProvider.localPwd,
        username: 'test@example.com',
      }
      vi.spyOn(authService, 'refreshToken').mockResolvedValue(mockUserToken)

      const result = await controller.refreshToken(refreshTokenDto)

      expect(result).toEqual(mockUserToken)
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto)
    })
  })

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto: LoginRequestDto = {
        username: 'test@example.com',
        password: 'password123',
      }
      vi.spyOn(authService, 'login').mockResolvedValue(mockUser)

      const result = await controller.login(loginDto)

      expect(result).toEqual(mockUser)
      expect(authService.login).toHaveBeenCalledWith(loginDto)
    })
  })

  describe('sendOTP', () => {
    it('should send OTP', async () => {
      const sendOTPDto: SendOTPRequestDto = {
        email: 'test@example.com',
      }
      const mockOTPResponse: ISendEmailResult = {
        type: EmailType.OTP,
        time: new Date(),
        duration: 3000,
      }
      vi.spyOn(authService, 'sendOTP').mockResolvedValue(mockOTPResponse)

      const result = await controller.sendOTP(sendOTPDto)

      expect(result).toEqual(mockOTPResponse)
      expect(authService.sendOTP).toHaveBeenCalledWith(sendOTPDto.email)
    })
  })

  describe('loginWithOTP', () => {
    it('should login with OTP', async () => {
      const otpLoginDto: OTPLoginDto = {
        email: 'test@example.com',
        code: '123456',
      }
      vi.spyOn(authService, 'loginWithOTP').mockResolvedValue(mockUser)

      const result = await controller.loginWithOTP(otpLoginDto)

      expect(result).toEqual(mockUser)
      expect(authService.loginWithOTP).toHaveBeenCalledWith(otpLoginDto.email, otpLoginDto.code)
    })
  })
})
