import type { ISendEmailResult, IUser, IUserFull, User } from '@nextboard/common'
import * as utils from '@/common/utils'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { EmailType, TAccountProvider, TAccountType, TUserGender } from '@nextboard/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MailService } from '../mail/mail.service'
import { CreateUserDto } from '../user/dto/create.dto'
import { UserService } from '../user/user.service'
import { VCodeService } from '../vcode/vcode.service'
import { AuthService } from './auth.service'
import { LoginRequestDto, RefreshTokenRequestDto } from './dto/login.dto'
import { TokenService } from './token.service'

describe('authService', () => {
  let service: AuthService
  let userService: UserService
  let tokenService: TokenService
  let mailService: MailService
  let vcodeService: VCodeService

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    displayName: null,
    emailVerifiedAt: null,
    avatar: '',
    gender: TUserGender.unknown,
    birthday: new Date(),
    online: true,
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
    password: 'hashed_password1',
    loginAt: new Date(),
  }

  const mockNewUser: IUser = {
    id: '1',
    email: 'newuser@example.com',
    name: 'New User',
    displayName: null,
    emailVerifiedAt: null,
    avatar: '',
    gender: TUserGender.unknown,
    birthday: new Date(),
    online: true,
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
    loginAt: new Date(),
  }

  const mockNewUserFull: IUserFull = {
    id: '1',
    email: 'newuser@example.com',
    name: 'New User',
    displayName: null,
    emailVerifiedAt: null,
    avatar: '',
    gender: TUserGender.unknown,
    birthday: new Date(),
    online: true,
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
    password: 'hashed_password1',
    resources: undefined,
    loginAt: new Date(),
  }

  const mockUserVerified: IUserFull = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    displayName: null,
    emailVerifiedAt: new Date(),
    avatar: '',
    gender: TUserGender.unknown,
    birthday: new Date(),
    online: true,
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
    password: 'hashed_password1',
    resources: undefined,
    loginAt: new Date(),
  }

  const mockTokens = {
    accessToken: 'mockAccessToken',
    refreshToken: 'mockRefreshToken',
    accessTokenExpiredAt: new Date(),
    refreshTokenExpiredAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: vi.fn(),
            findByEmailX: vi.fn(),
            create: vi.fn(),
            updateAccount: vi.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            validateJwt: vi.fn(),
            generateTokens: vi.fn(),
            refreshToken: vi.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerificationEmail: vi.fn(),
            sendOTP: vi.fn(),
          },
        },
        {
          provide: VCodeService,
          useValue: {
            verify: vi.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userService = module.get<UserService>(UserService)
    tokenService = module.get<TokenService>(TokenService)
    mailService = module.get<MailService>(MailService)
    vcodeService = module.get<VCodeService>(VCodeService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getCurrentUser', () => {
    it('should return the current user', async () => {
      const mockReq = {} as any
      const mockRes = {} as any
      vi.spyOn(tokenService, 'validateJwt').mockResolvedValue(mockUser)

      const result = await service.getCurrentUser(mockReq, mockRes)

      expect(result).toEqual(mockUser)
      expect(tokenService.validateJwt).toHaveBeenCalledWith(mockReq)
    })
  })

  describe('login', () => {
    it('should login successfully', async () => {
      const loginDto: LoginRequestDto = { username: 'test@example.com', password: 'password123' }
      vi.spyOn(userService, 'findByEmailX').mockResolvedValue(mockUserVerified)
      vi.spyOn(utils, 'comparePasswords').mockResolvedValue(true)
      vi.spyOn(tokenService, 'generateTokens').mockResolvedValue(mockTokens)

      const {
        password,
        ...mockUserPublic
      } = mockUserVerified

      const result = await service.login(loginDto)

      expect(result).toEqual({ ...mockUserPublic, ...mockTokens })
      expect(userService.updateAccount).toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for invalid password', async () => {
      const loginDto: LoginRequestDto = { username: 'test@example.com', password: 'wrong-password' }
      vi.spyOn(userService, 'findByEmailX').mockResolvedValue(mockUserVerified)
      vi.spyOn(utils, 'comparePasswords').mockResolvedValue(false)

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw NotFoundException for non-existent user', async () => {
      const loginDto: LoginRequestDto = { username: 'nonexistent@example.com', password: 'password123' }
      vi.spyOn(userService, 'findByEmailX').mockResolvedValue(null)

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException)
    })

    it('should throw UnauthorizedException for unverified email', async () => {
      const loginDto: LoginRequestDto = { username: 'test@example.com', password: 'password123' }
      vi.spyOn(userService, 'findByEmailX').mockResolvedValue({ ...mockUser, emailVerifiedAt: null })

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const signUpDto: CreateUserDto = {
        email: 'newuser@example.com',
        password: 'password123',
        password1: 'password123',
        name: 'New User',
      }
      vi.spyOn(userService, 'create').mockResolvedValue(mockNewUser)

      const result = await service.signUp(signUpDto)

      expect(result).toEqual(mockNewUser)
      expect(userService.create).toHaveBeenCalledWith(signUpDto, expect.objectContaining({
        type: TAccountType.local,
        provider: TAccountProvider.localPwd,
        providerAccountId: signUpDto.email,
      }))
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(signUpDto.email)
    })

    it('should resend verification email if user already exists but email is not verified', async () => {
      const signUpDto: CreateUserDto = {
        email: 'existinguser@example.com',
        password: 'password123',
        password1: 'password123',
        name: 'Existing User',
      }
      const existingUser = { ...mockNewUser, email: 'existinguser@example.com' }
      vi.spyOn(userService, 'findByEmail').mockResolvedValue(existingUser)
      vi.spyOn(mailService, 'sendVerificationEmail').mockResolvedValue({
        time: new Date(),
        type: EmailType.VERIFY,
      })

      const result = await service.signUp(signUpDto)

      expect(result).toEqual(existingUser)
      expect(userService.create).not.toHaveBeenCalled()
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(signUpDto.email)
    })
  })

  describe('sendOTP', () => {
    it('should send OTP successfully', async () => {
      const email = 'test@example.com'
      const mockResult: ISendEmailResult = { time: new Date(), duration: 300, type: EmailType.OTP }
      vi.spyOn(mailService, 'sendOTP').mockResolvedValue(mockResult)

      const result = await service.sendOTP(email)

      expect(result).toEqual(mockResult)
      expect(mailService.sendOTP).toHaveBeenCalledWith(email)
    })
  })

  describe('loginWithOTP', () => {
    it('should login with OTP successfully for existing user', async () => {
      const email = 'test@example.com'
      const code = '123456'
      vi.spyOn(vcodeService, 'verify').mockResolvedValue(true)
      vi.spyOn(userService, 'findByEmailX').mockResolvedValue(mockUserVerified)
      vi.spyOn(tokenService, 'generateTokens').mockResolvedValue(mockTokens)

      const {
        password,
        ...mockUserPublic
      } = mockUserVerified

      const result = await service.loginWithOTP(email, code)

      expect(result).toEqual({ ...mockUserPublic, ...mockTokens })
      expect(userService.updateAccount).toHaveBeenCalled()
    })

    it('should create new user and login with OTP for non-existent user', async () => {
      const email = 'newuser@example.com'
      const code = '123456'
      vi.spyOn(vcodeService, 'verify').mockResolvedValue(true)
      vi.spyOn(userService, 'findByEmailX').mockResolvedValueOnce(null).mockResolvedValueOnce(mockNewUserFull)
      vi.spyOn(userService, 'create').mockResolvedValue(mockNewUser)
      vi.spyOn(tokenService, 'generateTokens').mockResolvedValue(mockTokens)

      const {
        password,
        ...mockUserPublic
      } = mockNewUserFull

      const result = await service.loginWithOTP(email, code)

      expect(result).toEqual({ ...mockUserPublic, ...mockTokens })
      expect(userService.create).toHaveBeenCalled()
      expect(userService.updateAccount).toHaveBeenCalled()
    })

    it('should throw UnauthorizedException for invalid OTP', async () => {
      const email = 'test@example.com'
      const code = 'invalid'
      vi.spyOn(vcodeService, 'verify').mockResolvedValue(false)

      await expect(service.loginWithOTP(email, code)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('refreshToken', () => {
    it('should refresh tokens successfully', async () => {
      const dto: RefreshTokenRequestDto = {
        refreshToken: 'valid-refresh-token',
        provider: TAccountProvider.localPwd,
        username: 'test@example.com',
      }
      vi.spyOn(tokenService, 'refreshToken').mockResolvedValue(mockTokens)

      const result = await service.refreshToken(dto)

      expect(result).toEqual(mockTokens)
      expect(tokenService.refreshToken).toHaveBeenCalledWith(dto)
      expect(userService.updateAccount).toHaveBeenCalledWith(dto.provider, dto.username, {
        accessToken: mockTokens.accessToken,
        refreshToken: mockTokens.refreshToken,
        expiredAt: mockTokens.accessTokenExpiredAt,
        refreshExpiredAt: mockTokens.refreshTokenExpiredAt,
      })
    })

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      const dto: RefreshTokenRequestDto = {
        refreshToken: 'invalid-refresh-token',
        provider: TAccountProvider.localPwd,
        username: 'test@example.com',
      }
      vi.spyOn(tokenService, 'refreshToken').mockRejectedValue(new UnauthorizedException('Invalid refresh token'))

      await expect(service.refreshToken(dto)).rejects.toThrow(UnauthorizedException)
      expect(tokenService.refreshToken).toHaveBeenCalledWith(dto)
      expect(userService.updateAccount).not.toHaveBeenCalled()
    })
  })
})
