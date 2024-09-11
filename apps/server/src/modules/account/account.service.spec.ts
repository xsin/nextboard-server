import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Account, IListQueryDto, IListQueryResult } from '@nextboard/common'
import { Prisma, TAccountProvider } from '@nextboard/common'
import { PrismaService } from '../prisma/prisma.service'
import { AccountService } from './account.service'
import { UpdateAccountDto } from './dto/update.dto'
import { buildFindManyParams } from '@/common/utils'

// Mock the buildFindManyParams function
vi.mock('@/common/utils', () => ({
  buildFindManyParams: vi.fn(),
}))

describe('accountService', () => {
  let service: AccountService
  let prismaService: PrismaService

  const mockPrismaService = {
    account: {
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    service = module.get<AccountService>(AccountService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('update', () => {
    it('should update an account', async () => {
      const provider: TAccountProvider = 'google'
      const providerAccountId = '123456'
      const expiredAt = new Date('2023-01-01')
      const updateAccountDto: UpdateAccountDto = {
        accessToken: 'new_access_token',
        expiredAt,
        refreshToken: 'new_refresh_token',
        tokenType: 'Bearer',
        scope: 'email profile',
      }

      const expectedResult: Account = {
        id: '1',
        userId: 'user1',
        type: 'oauth',
        provider,
        providerAccountId,
        accessToken: updateAccountDto.accessToken,
        refreshToken: updateAccountDto.refreshToken,
        expiredAt,
        tokenType: updateAccountDto.tokenType,
        scope: updateAccountDto.scope,
        idToken: null,
        sessionState: null,
        refreshExpiredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.spyOn(prismaService.account, 'update').mockResolvedValue(expectedResult)

      const result = await service.update(provider, providerAccountId, updateAccountDto)

      expect(result).toEqual(expectedResult)
      expect(prismaService.account.update).toHaveBeenCalledWith({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
        data: {
          accessToken: 'new_access_token',
          expiredAt: new Date('2023-01-01'),
          refreshToken: 'new_refresh_token',
          tokenType: 'Bearer',
          scope: 'email profile',
        },
      })
    })
  })

  describe('findAll', () => {
    it('should return a list of accounts', async () => {
      const dto: IListQueryDto = { page: 1, limit: 10 }
      const mockAccounts: Account[] = [
        {
          id: '1',
          userId: 'user1',
          type: 'oauth',
          provider: TAccountProvider.google,
          providerAccountId: '123',
          refreshToken: 'refresh1',
          accessToken: 'access1',
          expiredAt: new Date(),
          refreshExpiredAt: null,
          tokenType: 'Bearer',
          scope: 'email profile',
          idToken: null,
          sessionState: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user2',
          type: 'oauth',
          provider: TAccountProvider.github,
          providerAccountId: '456',
          refreshToken: 'refresh2',
          accessToken: 'access2',
          expiredAt: new Date(),
          refreshExpiredAt: null,
          tokenType: 'Bearer',
          scope: 'email',
          idToken: null,
          sessionState: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]
      const expectedResult: IListQueryResult<Account> = {
        items: mockAccounts,
        total: 2,
        page: 1,
        limit: 10,
      }

      const mockFindManyParams: Prisma.AccountFindManyArgs = { skip: 0, take: 10 }
      vi.mocked(buildFindManyParams).mockReturnValue(mockFindManyParams)

      vi.spyOn(prismaService.account, 'findMany').mockResolvedValue(mockAccounts)
      vi.spyOn(prismaService.account, 'count').mockResolvedValue(2)

      const result = await service.findAll(dto)

      expect(result).toEqual(expectedResult)
      expect(buildFindManyParams).toHaveBeenCalledWith(dto)
      expect(prismaService.account.findMany).toHaveBeenCalledWith(mockFindManyParams)
      expect(prismaService.account.count).toHaveBeenCalledWith({ where: mockFindManyParams.where })
    })
  })
})
