import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VCode } from '@nextboard/common'
import { PrismaService } from '../prisma/prisma.service'
import { VCodeService } from './vcode.service'
import { CreateVCodeDto } from './dto/create.dto'
import { QueryVCodeDto } from './dto/query.dto'

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
})
