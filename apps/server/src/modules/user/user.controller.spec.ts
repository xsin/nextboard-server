import type { User } from '@nextboard/common'
import { ListQueryDto } from '@/common/dto'
import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { EmailType, NBError, TAccountProvider, TAccountType, TUserGender } from '@nextboard/common'
import { Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { VCodeService } from '../vcode/vcode.service'
import { CreateUserDto } from './dto/create.dto'
import { UpdateUserDto } from './dto/update.dto'
import { UserController } from './user.controller'
import { UserService } from './user.service'

describe('userController', () => {
  let controller: UserController
  let mockVCodeService: Partial<VCodeService>
  let mockResponse: Partial<Response>

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
  }

  const mockUserService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    findUserResources: vi.fn(),
    getUserProfileById: vi.fn(),
    getUserProfileByEmail: vi.fn(),
    verifyEmail: vi.fn(),
  }

  beforeEach(async () => {
    mockVCodeService = {
      generateOwner: vi.fn(),
      verify: vi.fn(),
    }
    mockResponse = {
      redirect: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: VCodeService,
          useValue: mockVCodeService,
        },
      ],
    }).compile()

    controller = module.get<UserController>(UserController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        password1: 'password123',
        name: 'Test User',
      }
      mockUserService.create.mockResolvedValue(mockUser)

      const result = await controller.create(createUserDto)

      expect(result).toEqual(mockUser)
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto, expect.objectContaining({
        type: TAccountType.local,
        provider: TAccountProvider.localPwd,
        providerAccountId: createUserDto.email,
      }))
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const listQueryDto: ListQueryDto = { page: 1, limit: 10 }
      const mockResult = { items: [mockUser], total: 1, page: 1, limit: 10 }
      mockUserService.findAll.mockResolvedValue(mockResult)

      const result = await controller.findAll(listQueryDto)

      expect(result).toEqual(mockResult)
      expect(mockUserService.findAll).toHaveBeenCalledWith(listQueryDto)
    })
  })

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser)

      const result = await controller.findOne('1')

      expect(result).toEqual(mockUser)
      expect(mockUserService.findOne).toHaveBeenCalledWith('1')
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' }
      mockUserService.update.mockResolvedValue({ ...mockUser, ...updateUserDto })

      const result = await controller.update('1', updateUserDto)

      expect(result).toEqual({ ...mockUser, ...updateUserDto })
      expect(mockUserService.update).toHaveBeenCalledWith('1', updateUserDto)
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUserService.remove.mockResolvedValue(mockUser)

      const result = await controller.remove('1')

      expect(result).toEqual(mockUser)
      expect(mockUserService.remove).toHaveBeenCalledWith('1')
    })
  })

  describe('getResources', () => {
    it('should return user resources', async () => {
      const mockResources = { items: [{ id: '1', name: 'Resource 1' }], total: 1, page: 1, limit: 10 }
      mockUserService.findUserResources.mockResolvedValue(mockResources)

      const result = await controller.getResources({ user: { email: 'test@example.com' } } as any)

      expect(result).toEqual(mockResources)
      expect(mockUserService.findUserResources).toHaveBeenCalledWith('test@example.com')
    })
  })

  describe('getProfile', () => {
    it('should return user profile by id', async () => {
      const mockProfile = { id: '1', name: 'Test User', email: 'test@example.com' }
      mockUserService.getUserProfileById.mockResolvedValue(mockProfile)

      const result = await controller.getProfile('1')

      expect(result).toEqual(mockProfile)
      expect(mockUserService.getUserProfileById).toHaveBeenCalledWith('1')
    })

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(controller.getProfile('')).rejects.toThrow(BadRequestException)
    })
  })

  describe('getSelfProfile', () => {
    it('should return self profile', async () => {
      const mockProfile = { id: '1', name: 'Test User', email: 'test@example.com' }
      mockUserService.getUserProfileByEmail.mockResolvedValue(mockProfile)

      const result = await controller.getSelfProfile({ user: { email: 'test@example.com' } } as any)

      expect(result).toEqual(mockProfile)
      expect(mockUserService.getUserProfileByEmail).toHaveBeenCalledWith('test@example.com')
    })
  })

  describe('verifyEmail', () => {
    it('should verify user email and redirect to success URL', async () => {
      const email = 'test@example.com'
      const vcode = '123456'
      const redirect = 'http://example.com/success'

      vi.spyOn(mockUserService, 'verifyEmail').mockResolvedValue(mockUser)
      vi.spyOn(mockVCodeService, 'generateOwner').mockReturnValue(`${email}:${EmailType.VERIFY}`)
      vi.spyOn(mockVCodeService, 'verify').mockResolvedValue(true)

      await controller.verifyEmail(mockResponse as Response, email, vcode, redirect)

      expect(mockVCodeService.generateOwner).toHaveBeenCalledWith(email, EmailType.VERIFY)
      expect(mockVCodeService.verify).toHaveBeenCalledWith({ owner: `${email}:${EmailType.VERIFY}`, code: vcode })
      expect(mockUserService.verifyEmail).toHaveBeenCalledWith(email)
      expect(mockResponse.redirect).toHaveBeenCalledWith(`${redirect}?success=true`)
    })

    it('should verify user email and return success message if no redirect URL', async () => {
      const email = 'test@example.com'
      const vcode = '123456'
      const mockUser = { id: '1', email }

      vi.spyOn(mockUserService, 'verifyEmail').mockResolvedValue(mockUser)
      vi.spyOn(mockVCodeService, 'generateOwner').mockReturnValue(`${email}:${EmailType.VERIFY}`)
      vi.spyOn(mockVCodeService, 'verify').mockResolvedValue(true)

      await controller.verifyEmail(mockResponse as Response, email, vcode, '')

      expect(mockVCodeService.generateOwner).toHaveBeenCalledWith(email, EmailType.VERIFY)
      expect(mockVCodeService.verify).toHaveBeenCalledWith({ owner: `${email}:${EmailType.VERIFY}`, code: vcode })
      expect(mockUserService.verifyEmail).toHaveBeenCalledWith(email)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith('Email verified successfully')
    })

    it('should throw BadRequestException if email or vcode is not provided', async () => {
      await expect(controller.verifyEmail(mockResponse as Response, '', '123456', '')).rejects.toThrow(BadRequestException)
      await expect(controller.verifyEmail(mockResponse as Response, 'test@example.com', '', '')).rejects.toThrow(BadRequestException)
    })

    it('should redirect to error URL if verification fails', async () => {
      const email = 'test@example.com'
      const vcode = '123456'
      const redirect = 'http://example.com/error'

      vi.spyOn(mockVCodeService, 'generateOwner').mockReturnValue(`${email}:${EmailType.VERIFY}`)
      vi.spyOn(mockVCodeService, 'verify').mockResolvedValue(false)

      await controller.verifyEmail(mockResponse as Response, email, vcode, redirect)

      expect(mockVCodeService.generateOwner).toHaveBeenCalledWith(email, EmailType.VERIFY)
      expect(mockVCodeService.verify).toHaveBeenCalledWith({ owner: `${email}:${EmailType.VERIFY}`, code: vcode })
      expect(mockResponse.redirect).toHaveBeenCalledWith(`${redirect}?error=${NBError.AUTH_INVALID_OTP}`)
    })

    it('should throw BadRequestException if verification fails and no redirect URL', async () => {
      const email = 'test@example.com'
      const vcode = '123456'

      vi.spyOn(mockVCodeService, 'generateOwner').mockReturnValue(`${email}:${EmailType.VERIFY}`)
      vi.spyOn(mockVCodeService, 'verify').mockResolvedValue(false)

      await expect(controller.verifyEmail(mockResponse as Response, email, vcode, '')).rejects.toThrow(BadRequestException)
    })
  })
})
