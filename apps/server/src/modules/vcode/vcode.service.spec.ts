import type { VCode } from '@xsin/xboard'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PrismaService } from '../prisma/prisma.service'
import { CreateVCodeDto } from './dto/create.dto'
import { QueryVCodeDto } from './dto/query.dto'
import { VCodeService } from './vcode.service'

describe('vCodeService', () => {
  let service: VCodeService
  let prismaService: PrismaService

  const mockVCode: VCode = {
    id: 1,
    owner: 'user1',
    code: '123456',
    expiredAt: new Date(),
    createdAt: new Date(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VCodeService,
        {
          provide: PrismaService,
          useValue: {
            vCode: {
              create: vi.fn(),
              findUnique: vi.fn(),
              delete: vi.fn(),
              findFirst: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<VCodeService>(VCodeService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a VCode', async () => {
      const expiredAt = new Date()
      const dto: CreateVCodeDto = { owner: 'user1', code: '123456', expiredAt }
      const expectedResult: VCode = {
        ...mockVCode,
        owner: dto.owner,
        code: dto.code,
        expiredAt,
      }
      vi.spyOn(prismaService.vCode, 'create').mockResolvedValue(expectedResult)

      const result = await service.create(dto)
      expect(result).toEqual(expectedResult)
      expect(prismaService.vCode.create).toHaveBeenCalledWith({ data: dto })
    })
  })

  describe('find', () => {
    it('should find a VCode', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      const expectedResult: VCode = {
        ...mockVCode,
        owner: dto.owner,
        code: dto.code,
        expiredAt: new Date(),
      }
      vi.spyOn(prismaService.vCode, 'findUnique').mockResolvedValue(expectedResult)

      const result = await service.find(dto)
      expect(result).toEqual(expectedResult)
      expect(prismaService.vCode.findUnique).toHaveBeenCalledWith({
        where: { owner_code: dto },
      })
    })
  })

  describe('delete', () => {
    it('should delete a VCode', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      const expectedResult: VCode = {
        ...mockVCode,
        owner: dto.owner,
        code: dto.code,
        expiredAt: new Date(),
      }
      vi.spyOn(prismaService.vCode, 'delete').mockResolvedValue(expectedResult)

      const result = await service.delete(dto)
      expect(result).toEqual(expectedResult)
      expect(prismaService.vCode.delete).toHaveBeenCalledWith({
        where: { owner_code: dto },
      })
    })
  })

  describe('verify', () => {
    it('should return true for a valid code', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      const expectedResult: VCode = {
        ...mockVCode,
        owner: dto.owner,
        code: dto.code,
        expiredAt: new Date(Date.now() + 3600000),
      }
      vi.spyOn(service, 'find').mockResolvedValue(expectedResult)

      const result = await service.verify(dto)
      expect(result).toBe(true)
    })

    it('should return false for an expired code', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      const expectedResult: VCode = {
        ...mockVCode,
        owner: dto.owner,
        code: dto.code,
        expiredAt: new Date(Date.now() - 3600000),
      }
      vi.spyOn(service, 'find').mockResolvedValue(expectedResult)

      const result = await service.verify(dto)
      expect(result).toBe(false)
    })

    it('should return false for a non-existent code', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      vi.spyOn(service, 'find').mockResolvedValue(null)

      const result = await service.verify(dto)
      expect(result).toBe(false)
    })
  })

  describe('hasValidCode', () => {
    it('should return true if user has a valid code', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      const expectedResult: VCode = {
        ...mockVCode,
        owner: dto.owner,
        code: dto.code,
        expiredAt: new Date(Date.now() + 3600000),
      }
      vi.spyOn(prismaService.vCode, 'findFirst').mockResolvedValue(expectedResult)

      const result = await service.hasValidCode(dto)
      expect(result).toBe(true)
      expect(prismaService.vCode.findFirst).toHaveBeenCalledWith({
        where: { owner: dto.owner },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return false if user has no code', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      vi.spyOn(prismaService.vCode, 'findFirst').mockResolvedValue(null)

      const result = await service.hasValidCode(dto)
      expect(result).toBe(false)
      expect(prismaService.vCode.findFirst).toHaveBeenCalledWith({
        where: { owner: dto.owner },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return false if user has an expired code', async () => {
      const dto: QueryVCodeDto = { owner: 'user1', code: '123456' }
      const expectedResult: VCode = {
        ...mockVCode,
        owner: dto.owner,
        code: dto.code,
        expiredAt: new Date(Date.now() - 3600000),
      }
      vi.spyOn(prismaService.vCode, 'findFirst').mockResolvedValue(expectedResult)

      const result = await service.hasValidCode(dto)
      expect(result).toBe(false)
      expect(prismaService.vCode.findFirst).toHaveBeenCalledWith({
        where: { owner: dto.owner },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('hasCodeWithinResendInterval', () => {
    it('should return true if a valid code exists within the resend interval', async () => {
      const dto: QueryVCodeDto = { owner: 'test@example.com', code: '123456' }
      vi.spyOn(prismaService.vCode, 'findFirst').mockResolvedValue(mockVCode)

      const result = await service.hasCodeWithinResendInterval(dto, 60) // 60 seconds resend interval

      expect(result).toBe(true)
      expect(prismaService.vCode.findFirst).toHaveBeenCalledWith({
        where: { owner: dto.owner },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return false if no code exists', async () => {
      const dto: QueryVCodeDto = { owner: 'test@example.com', code: '123456' }
      vi.spyOn(prismaService.vCode, 'findFirst').mockResolvedValue(null)

      const result = await service.hasCodeWithinResendInterval(dto, 60)

      expect(result).toBe(false)
      expect(prismaService.vCode.findFirst).toHaveBeenCalledWith({
        where: { owner: dto.owner },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return false if the code exists but is outside the resend interval', async () => {
      const dto: QueryVCodeDto = { owner: 'test@example.com', code: '123456' }
      const expiredToken = {
        ...mockVCode,
        createdAt: new Date(Date.now() - 120000), // Created 2 minutes ago
      }
      vi.spyOn(prismaService.vCode, 'findFirst').mockResolvedValue(expiredToken)

      const result = await service.hasCodeWithinResendInterval(dto, 60) // 60 seconds resend interval

      expect(result).toBe(false)
      expect(prismaService.vCode.findFirst).toHaveBeenCalledWith({
        where: { owner: dto.owner },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('generateOwner', () => {
    it('should return owner if no suffix is provided', () => {
      const owner = 'user1'
      const result = service.generateOwner(owner)
      expect(result).toBe(owner)
    })

    it('should return owner with suffix if suffix is provided', () => {
      const owner = 'user1'
      const suffix = 'suffix'
      const result = service.generateOwner(owner, suffix)
      expect(result).toBe(`${owner}:${suffix}`)
    })
  })
})
