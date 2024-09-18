import type { IUser, IUserFull, IUserToken, IUserTokenPayload } from '@nextboard/common'
import type { Request } from 'express'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
/* eslint-disable dot-notation */
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { Cache } from 'cache-manager'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppConfigService } from '../config/config.service'
import { UserService } from '../user/user.service'
import { RefreshTokenRequestDto } from './dto/login.dto'
import { TokenService } from './token.service'

describe('tokenService', () => {
  let service: TokenService
  let jwtService: JwtService
  let userService: UserService
  let configService: AppConfigService
  let cacheManager: Cache
  let service1: TokenService
  let service2: TokenService
  let service3: TokenService

  const mockUser: IUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    displayName: 'Test User',
    emailVerifiedAt: new Date(),
    avatar: 'avatar.png',
    gender: 'male',
    birthday: new Date(),
    online: true,
    disabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
    loginAt: new Date(),
  }

  const mockUserFull: IUserFull = {
    ...mockUser,
    password: 'password',
  }

  const mockConfig = {
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    JWT_EXPIRY: 3600,
    JWT_REFRESH_EXPIRY: 86400,
    NB_REDIS_TTL_JWT_USER: 3600,
  }

  const mockConfig1 = {
    JWT_SECRET: '',
    JWT_REFRESH_SECRET: 'test-refresh-secret',
    JWT_EXPIRY: 3600,
    JWT_REFRESH_EXPIRY: 86400,
    NB_REDIS_TTL_JWT_USER: 3600,
  }

  const mockConfig2 = {
    JWT_SECRET: '',
    JWT_REFRESH_SECRET: '',
    JWT_EXPIRY: 3600,
    JWT_REFRESH_EXPIRY: 86400,
    NB_REDIS_TTL_JWT_USER: 3600,
  }

  const mockConfig3 = {
    JWT_SECRET: 'test-secret',
    JWT_REFRESH_SECRET: '',
    JWT_EXPIRY: 3600,
    JWT_REFRESH_EXPIRY: 86400,
    NB_REDIS_TTL_JWT_USER: 3600,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: vi.fn(),
            signAsync: vi.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByIdX: vi.fn(),
            findByEmail: vi.fn(),
            getItemCacheKey: vi.fn((...idLikes: string[]) => `user:${idLikes.join(':')}`),
          },
        },
        {
          provide: AppConfigService,
          useValue: mockConfig,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          },
        },
      ],
    }).compile()

    const module1: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: vi.fn(),
            signAsync: vi.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByIdX: vi.fn(),
            findByEmail: vi.fn(),
            getItemCacheKey: vi.fn((...idLikes: string[]) => `user:${idLikes.join(':')}`),
          },
        },
        {
          provide: AppConfigService,
          useValue: mockConfig1,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          },
        },
      ],
    }).compile()

    const module2: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: vi.fn(),
            signAsync: vi.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByIdX: vi.fn(),
            findByEmail: vi.fn(),
            getItemCacheKey: vi.fn((...idLikes: string[]) => `user:${idLikes.join(':')}`),
          },
        },
        {
          provide: AppConfigService,
          useValue: mockConfig2,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          },
        },
      ],
    }).compile()

    const module3: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: vi.fn(),
            signAsync: vi.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByIdX: vi.fn(),
            findByEmail: vi.fn(),
            getItemCacheKey: vi.fn((...idLikes: string[]) => `user:${idLikes.join(':')}`),
          },
        },
        {
          provide: AppConfigService,
          useValue: mockConfig3,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<TokenService>(TokenService)
    jwtService = module.get<JwtService>(JwtService)
    userService = module.get<UserService>(UserService)
    configService = module.get<AppConfigService>(AppConfigService)
    cacheManager = module.get<Cache>(CACHE_MANAGER)

    service1 = module1.get<TokenService>(TokenService)

    service2 = module2.get<TokenService>(TokenService)

    service3 = module3.get<TokenService>(TokenService)
  })

  describe('validateJwt', () => {
    it('should validate JWT and return user', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Request

      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: '1' })
      vi.spyOn(userService, 'findByIdX').mockResolvedValue(mockUserFull)

      const result = await service.validateJwt(mockRequest)
      expect(result).toEqual(expect.objectContaining({
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
      }))
      expect(result).not.toHaveProperty('password')
    })

    it('should throw UnauthorizedException for missing authorization header', async () => {
      const mockRequest = {
        headers: {},
      } as Request

      await expect(service.validateJwt(mockRequest)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException for invalid token format', async () => {
      const mockRequest = {
        headers: {
          authorization: 'InvalidFormat token',
        },
      } as Request

      await expect(service.validateJwt(mockRequest)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw Exception for invalid token', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer invalid-token',
        },
      } as Request

      vi.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'))

      await expect(service.validateJwt(mockRequest)).rejects.toThrow(Error)
    })

    it('should throw NotFoundException for non-existent user', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-token',
        },
      } as Request

      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: '1' })
      vi.spyOn(userService, 'findByIdX').mockResolvedValue(null)

      await expect(service.validateJwt(mockRequest)).rejects.toThrow(NotFoundException)
    })

    it('should use refresh token secret when isRefreshToken is true', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer valid-refresh-token',
        },
      } as Request

      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: '1' })
      vi.spyOn(userService, 'findByIdX').mockResolvedValue(mockUserFull)

      await service.validateJwt(mockRequest, true)

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-refresh-token', {
        secret: mockConfig.JWT_REFRESH_SECRET,
      })
    })

    it('should throw UnauthorizedException for empty token', async () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer ',
        },
      } as Request

      await expect(service.validateJwt(mockRequest)).rejects.toThrow(UnauthorizedException)
    })

    it('should handle malformed authorization header', async () => {
      const mockRequest = {
        headers: {
          authorization: 'malformed-header-without-space',
        },
      } as Request

      await expect(service.validateJwt(mockRequest)).rejects.toThrow(UnauthorizedException)
    })

    it('should handle empty authorization header', async () => {
      const mockRequest = {
        headers: {
          authorization: '',
        },
      } as Request

      await expect(service.validateJwt(mockRequest)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('parseUserFromJwt', () => {
    it('should parse user from JWT token and cache the result', async () => {
      const token = 'valid-token'
      const cacheKey = 'user:1:jwt'
      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: '1' })
      vi.spyOn(cacheManager, 'get').mockResolvedValue(null)
      vi.spyOn(userService, 'findByIdX').mockResolvedValue(mockUserFull)
      vi.spyOn(cacheManager, 'set').mockResolvedValue(undefined)

      const result = await service.parseUserFrowJwt(token)
      expect(result).toEqual(mockUserFull)
      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey)
      expect(userService.findByIdX).toHaveBeenCalledWith('1', false)
      expect(cacheManager.set).toHaveBeenCalledWith(cacheKey, mockUserFull, mockConfig.NB_REDIS_TTL_JWT_USER * 1000)
    })

    it('should return user from cache if available', async () => {
      const token = 'valid-token'
      const cacheKey = 'user:1:jwt'
      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: '1' })
      vi.spyOn(cacheManager, 'get').mockResolvedValue(mockUserFull)

      const result = await service.parseUserFrowJwt(token)
      expect(result).toEqual(mockUserFull)
      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey)
      expect(userService.findByIdX).not.toHaveBeenCalled()
      expect(cacheManager.set).not.toHaveBeenCalled()
    })

    it('should use refresh token secret when isRefreshToken is true', async () => {
      const token = 'valid-refresh-token'
      const cacheKey = 'user:1:jwt'
      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: '1' })
      vi.spyOn(cacheManager, 'get').mockResolvedValue(null)
      vi.spyOn(userService, 'findByIdX').mockResolvedValue(mockUserFull)
      vi.spyOn(cacheManager, 'set').mockResolvedValue(undefined)

      await service.parseUserFrowJwt(token, true)

      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-refresh-token', {
        secret: mockConfig.JWT_REFRESH_SECRET,
      })
      expect(cacheManager.get).toHaveBeenCalledWith(cacheKey)
      expect(userService.findByIdX).toHaveBeenCalledWith('1', false)
      expect(cacheManager.set).toHaveBeenCalledWith(cacheKey, mockUserFull, mockConfig.NB_REDIS_TTL_JWT_USER * 1000)
    })

    it('should throw Exception for invalid token', async () => {
      const token = 'invalid-token'
      vi.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'))

      await expect(service.parseUserFrowJwt(token)).rejects.toThrow(Error)
    })

    it('should return null for non-existent user', async () => {
      const token = 'valid-token'
      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ sub: '1' })
      vi.spyOn(cacheManager, 'get').mockResolvedValue(null)
      vi.spyOn(userService, 'findByIdX').mockResolvedValue(null)

      const result = await service.parseUserFrowJwt(token)
      expect(result).toBeNull()
      expect(cacheManager.get).toHaveBeenCalledWith('user:1:jwt')
      expect(userService.findByIdX).toHaveBeenCalledWith('1', false)
      expect(cacheManager.set).not.toHaveBeenCalled()
    })
  })

  describe('refreshToken', () => {
    it('should refresh token and return new tokens', async () => {
      const mockDto: RefreshTokenRequestDto = { refreshToken: 'valid-refresh-token' }
      const mockPayload: IUserTokenPayload = { iss: 'NextBoard', username: 'test@example.com', sub: '1' }
      const mockTokens: IUserToken = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        accessTokenExpiredAt: new Date(),
        refreshTokenExpiredAt: new Date(),
      }

      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload)
      vi.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser)
      vi.spyOn(service, 'generateTokens').mockResolvedValue(mockTokens)

      const result = await service.refreshToken(mockDto)
      expect(result).toEqual(mockTokens)
    })

    it('should throw Exception for invalid refresh token', async () => {
      const mockDto: RefreshTokenRequestDto = { refreshToken: 'invalid-refresh-token' }
      vi.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error('Invalid token'))
      await expect(service.refreshToken(mockDto)).rejects.toThrow(Error)
    })

    it('should throw NotFoundException for non-existent user', async () => {
      const mockDto: RefreshTokenRequestDto = { refreshToken: 'valid-refresh-token' }
      const mockPayload: IUserTokenPayload = { iss: 'NextBoard', username: 'test@example.com', sub: '1' }
      vi.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload)
      vi.spyOn(userService, 'findByEmail').mockResolvedValue(null)
      await expect(service.refreshToken(mockDto)).rejects.toThrow(NotFoundException)
    })
  })

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        accessTokenExpiredAt: expect.any(Date),
        refreshTokenExpiredAt: expect.any(Date),
      }

      vi.spyOn(jwtService, 'signAsync').mockImplementation((_payload, options) => {
        if (options.secret === mockConfig.JWT_SECRET) {
          return Promise.resolve('access-token')
        }
        else if (options.secret === mockConfig.JWT_REFRESH_SECRET) {
          return Promise.resolve('refresh-token')
        }
        return Promise.resolve('unknown-token')
      })

      const result = await service.generateTokens(mockUser)
      expect(result).toEqual(mockTokens)
      expect(jwtService.signAsync).toHaveBeenCalledTimes(2)
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, expect.any(Object), {
        expiresIn: configService.JWT_EXPIRY,
        secret: configService.JWT_SECRET,
      })
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, expect.any(Object), {
        expiresIn: configService.JWT_REFRESH_EXPIRY,
        secret: configService.JWT_REFRESH_SECRET,
      })
    })
  })

  describe('getJwtSecret', () => {
    it('should return the JWT secret from config', () => {
      const result = service['getJwtSecret']()
      expect(result).toBe(mockConfig.JWT_SECRET)
    })

    it('should return default secret if JWT secret is empty', () => {
      const result = service1['getJwtSecret']()
      expect(result).toBe('NextBoard')
    })
  })

  describe('getJwtRefreshSecret', () => {
    it('should return the JWT refresh secret from config', () => {
      const result = service['getJwtRefreshSecret']()
      expect(result).toBe(mockConfig.JWT_REFRESH_SECRET)
    })

    it('should return JWT secret if JWT refresh secret is empty', () => {
      const result = service3['getJwtRefreshSecret']()
      expect(result).toBe(mockConfig.JWT_SECRET)
    })

    it('should return default secret if both JWT and JWT refresh secrets are empty', () => {
      const result = service2['getJwtRefreshSecret']()
      expect(result).toBe('NextBoard')
    })
  })
})
