import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Account, IUserFull, IUserProfile, Resource, User } from '@nextboard/common'
import { Prisma, TAccountProvider, TAccountType, TResourceOpenTarget, TUserGender } from '@nextboard/common'
import { PrismaService } from '../prisma/prisma.service'
import { AccountService } from '../account/account.service'
import { AppConfigService } from '../config/config.service'
import { CreateAccountDto } from '../account/dto/create.dto'
import { UpdateAccountDto } from '../account/dto/update.dto'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create.dto'
import { UpdateUserDto } from './dto/update.dto'
import { UserColumns } from './dto/user.ext'
import { buildFindManyParams } from '@/common/utils'
import { saltAndHashPassword } from '@/common/utils/password'

vi.mock('@/common/utils', () => ({
  buildFindManyParams: vi.fn(),
}))

vi.mock('@/common/utils/password', () => ({
  saltAndHashPassword: vi.fn(),
}))

describe('userService', () => {
  let service: UserService
  let prismaService: PrismaService
  let accountService: AccountService
  let configService: AppConfigService

  const mockUser1: User = {
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

  const mockUser2: User = {
    id: '2',
    email: 'test2@example.com',
    name: 'Test User2',
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
    password: 'hashed_password2',
  }

  const mockResources: Resource[] = [
    {
      id: '1',
      name: 'resource1',
      displayName: 'resource1',
      url: null,
      icon: null,
      visible: true,
      keepAlive: false,
      target: TResourceOpenTarget.external,
      remark: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '1',
      updatedBy: '1',
    },
    {
      id: '2',
      name: 'resource2',
      displayName: 'resource2',
      url: null,
      icon: null,
      visible: true,
      keepAlive: false,
      target: TResourceOpenTarget.internal,
      remark: null,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '1',
      updatedBy: '1',
    },
  ]

  const mockPrismaService = {
    user: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    resource: {
      findMany: vi.fn(),
    },
  }

  const mockAccountService = {
    update: vi.fn(),
  }

  const mockConfigService = {
    NB_DEFAULT_ROLE_ID: 'default-role-id',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: AccountService, useValue: mockAccountService },
        { provide: AppConfigService, useValue: mockConfigService },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
    prismaService = module.get<PrismaService>(PrismaService)
    accountService = module.get<AccountService>(AccountService)
    configService = module.get<AppConfigService>(AppConfigService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password', name: 'Test User', password1: 'password' }
      const createAccountDto: CreateAccountDto = { type: 'oauth', provider: 'google', providerAccountId: '123', userId: '1' }
      const mockUser0: User = {
        id: '1',
        email: createUserDto.email,
        name: createUserDto.name,
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
        password: 'hashed_password',
      }
      vi.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser0)
      vi.mocked(saltAndHashPassword).mockResolvedValue('hashed_password')

      const result = await service.create(createUserDto, createAccountDto)

      expect(result).toEqual(mockUser0)
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createUserDto,
          password: 'hashed_password',
          accounts: { create: createAccountDto },
          roles: { create: { role: { connect: { id: configService.NB_DEFAULT_ROLE_ID } } } },
        }),
        select: UserColumns,
      })
    })

    it('should throw ConflictException if user already exists', async () => {
      const createUserDto: CreateUserDto = { email: 'test@example.com', password: 'password', name: 'Test User', password1: 'password' }
      const createAccountDto: CreateAccountDto = { type: 'oauth', provider: 'google', providerAccountId: '123', userId: '1' }

      vi.spyOn(service, 'findByEmail').mockResolvedValue(mockUser1)

      await expect(service.create(createUserDto, createAccountDto)).rejects.toThrow(ConflictException)
    })
  })

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const dto = { page: 1, limit: 10 }
      const mockUsers = [mockUser1, mockUser2]
      const mockFindManyParams: Prisma.UserFindManyArgs = { skip: 0, take: 10 }

      vi.mocked(buildFindManyParams).mockReturnValue(mockFindManyParams)
      vi.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers)
      vi.spyOn(prismaService.user, 'count').mockResolvedValue(2)

      const result = await service.findAll(dto)

      expect(result).toEqual({
        items: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
      })
      expect(prismaService.user.findMany).toHaveBeenCalledWith(mockFindManyParams)
      expect(prismaService.user.count).toHaveBeenCalledWith({ where: mockFindManyParams.where })
    })
  })

  describe('findOne', () => {
    it('should find a user by id', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser1)

      const result = await service.findOne('1')

      expect(result).toEqual(mockUser1)
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: UserColumns,
      })
    })
  })

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser1)

      const result = await service.findByEmail('test@example.com')

      expect(result).toEqual(mockUser1)
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: UserColumns,
      })
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' }
      const mockUser = { ...mockUser1, name: 'Updated Name' }
      vi.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser)

      const result = await service.update('1', updateUserDto)

      expect(result).toEqual(mockUser)
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateUserDto,
        select: UserColumns,
      })
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      vi.spyOn(prismaService.user, 'delete').mockResolvedValue(mockUser1)

      const result = await service.remove('1')

      expect(result).toEqual(mockUser1)
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        select: UserColumns,
      })
    })
  })

  describe('verifyEmail', () => {
    it('should verify user email', async () => {
      const verifiedUser = { ...mockUser1, emailVerifiedAt: new Date() }
      vi.spyOn(service, 'findByEmail').mockResolvedValue(mockUser1)
      vi.spyOn(prismaService.user, 'update').mockResolvedValue(verifiedUser)

      const result = await service.verifyEmail('test@example.com')

      expect(result).toEqual(verifiedUser)
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { emailVerifiedAt: expect.any(Date) },
        select: UserColumns,
      })
    })

    it('should throw ConflictException if user not found', async () => {
      vi.spyOn(service, 'findByEmail').mockResolvedValue(null)

      await expect(service.verifyEmail('nonexistent@example.com')).rejects.toThrow(ConflictException)
    })
  })

  describe('findUserResources', () => {
    it('should find user resources', async () => {
      const mockUser: IUserFull = {
        ...mockUser1,
        resources: mockResources,
      }
      vi.spyOn(service, 'findByEmailX').mockResolvedValue(mockUser)

      const result = await service.findUserResources('test@example.com')

      expect(result).toEqual({
        items: mockUser.resources,
        total: 2,
        page: 1,
        limit: 2,
      })
    })

    it('should throw NotFoundException if user not found', async () => {
      vi.spyOn(service, 'findByEmailX').mockResolvedValue(null)

      await expect(service.findUserResources('nonexistent@example.com')).rejects.toThrow(NotFoundException)
    })
  })

  describe('getUserProfileByEmail', () => {
    it('should get user profile by email', async () => {
      const mockUser: IUserFull = {
        ...mockUser1,
        roles: [],
        permissions: [],
        resources: [],
      }

      const expectedResult: IUserProfile = {
        id: mockUser.id,
        name: mockUser.name,
        displayName: mockUser.displayName,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        roleNames: mockUser.roleNames,
        permissionNames: mockUser.permissionNames,
        email: mockUser.email,
        emailVerifiedAt: mockUser.emailVerifiedAt,
        avatar: mockUser.avatar,
        gender: mockUser.gender,
        birthday: mockUser.birthday,
      }

      vi.spyOn(service, 'findUser').mockResolvedValue(mockUser)

      const result = await service.getUserProfileByEmail('test@example.com')

      expect(result).toEqual(expectedResult)
    })
  })

  describe('getUserProfileById', () => {
    it('should get user profile by id', async () => {
      const mockUser: IUserFull = {
        ...mockUser1,
        roles: [],
        permissions: [],
        resources: [],
      }

      const expectedResult: IUserProfile = {
        id: mockUser.id,
        name: mockUser.name,
        displayName: mockUser.displayName,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        roleNames: mockUser.roleNames,
        permissionNames: mockUser.permissionNames,
        email: mockUser.email,
        emailVerifiedAt: mockUser.emailVerifiedAt,
        avatar: mockUser.avatar,
        gender: mockUser.gender,
        birthday: mockUser.birthday,
      }

      vi.spyOn(service, 'findUser').mockResolvedValue(mockUser)

      const result = await service.getUserProfileById('1')

      expect(result).toEqual(expectedResult)
      expect(service.findUser).toHaveBeenCalledWith({ id: '1' })
    })
  })

  describe('updateAccount', () => {
    it('should update user account', async () => {
      const provider = TAccountProvider.google
      const providerAccountId = '123'
      const updateAccountDto: UpdateAccountDto = { accessToken: 'new_token' }
      const mockAccount: Account = {
        id: '1',
        provider,
        providerAccountId,
        accessToken: 'new_token',
        userId: '1',
        type: TAccountType.oauth,
        refreshToken: 'new_refresh_token',
        expiredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        refreshExpiredAt: new Date(),
        tokenType: 'bearer',
        scope: 'user',
        idToken: 'id_token',
        sessionState: 'session_state',
      }
      vi.spyOn(accountService, 'update').mockResolvedValue(mockAccount)

      const result = await service.updateAccount(provider, providerAccountId, updateAccountDto)

      expect(result).toEqual(mockAccount)
      expect(accountService.update).toHaveBeenCalledWith(provider, providerAccountId, updateAccountDto)
    })
  })

  describe('findUser', () => {
    it('should find a user with roles, permissions, and resources', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [
          {
            role: {
              id: 'role1',
              name: 'Admin',
              permissions: [
                { permission: { id: 'perm1', name: 'Read' } },
                { permission: { id: 'perm2', name: 'Write' } },
              ],
            },
          },
        ],
      }

      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser as any)
      vi.spyOn(prismaService.resource, 'findMany').mockResolvedValue(mockResources)

      const result = await service.findUser({ id: '1' })

      expect(result).toMatchObject({
        id: '1',
        email: 'test@example.com',
        roles: [{ id: 'role1', name: 'Admin' }],
        roleNames: ['Admin'],
        permissions: [{ id: 'perm1', name: 'Read' }, { id: 'perm2', name: 'Write' }],
        permissionNames: ['Read', 'Write'],
        resources: mockResources,
      })
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object),
      })
      expect(prismaService.resource.findMany).toHaveBeenCalled()
    })

    it('should find a user without resources when includeResources is false', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [
          {
            role: {
              id: 'role1',
              name: 'Admin',
              permissions: [
                { permission: { id: 'perm1', name: 'Read' } },
              ],
            },
          },
        ],
      }

      vi.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser as any)
      const findManySpy = vi.spyOn(prismaService.resource, 'findMany')

      const result = await service.findUser({ id: '1' }, false)

      expect(result).toMatchObject({
        id: '1',
        email: 'test@example.com',
        roles: [{ id: 'role1', name: 'Admin' }],
        roleNames: ['Admin'],
        permissions: [{ id: 'perm1', name: 'Read' }],
        permissionNames: ['Read'],
        resources: [],
      })
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: expect.any(Object),
      })
      expect(findManySpy).not.toHaveBeenCalled()
    })
  })

  describe('findByEmailX', () => {
    it('should find a user by email with full details', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [{ role: { id: 'role1', name: 'User', permissions: [] } }],
      }

      vi.spyOn(service, 'findUser').mockResolvedValue(mockUser as any)

      const result = await service.findByEmailX('test@example.com')

      expect(result).toEqual(mockUser)
      expect(service.findUser).toHaveBeenCalledWith({ email: 'test@example.com' }, true)
    })

    it('should find a user by email without resources', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [{ role: { id: 'role1', name: 'User', permissions: [] } }],
      }

      vi.spyOn(service, 'findUser').mockResolvedValue(mockUser as any)

      const result = await service.findByEmailX('test@example.com', false)

      expect(result).toEqual(mockUser)
      expect(service.findUser).toHaveBeenCalledWith({ email: 'test@example.com' }, false)
    })
  })

  describe('findByIdX', () => {
    it('should find a user by id with full details', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [{ role: { id: 'role1', name: 'User', permissions: [] } }],
      }

      vi.spyOn(service, 'findUser').mockResolvedValue(mockUser as any)

      const result = await service.findByIdX('1')

      expect(result).toEqual(mockUser)
      expect(service.findUser).toHaveBeenCalledWith({ id: '1' }, true)
    })

    it('should find a user by id without resources', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        roles: [{ role: { id: 'role1', name: 'User', permissions: [] } }],
      }

      vi.spyOn(service, 'findUser').mockResolvedValue(mockUser as any)

      const result = await service.findByIdX('1', false)

      expect(result).toEqual(mockUser)
      expect(service.findUser).toHaveBeenCalledWith({ id: '1' }, false)
    })
  })
})
