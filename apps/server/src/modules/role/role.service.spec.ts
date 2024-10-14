import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { Role } from '@xsin/xboard'
import { PrismaService } from '../prisma/prisma.service'
import { RoleService } from './role.service'

describe('roleService', () => {
  let service: RoleService
  let prismaService: PrismaService

  const mockRole: Role = {
    id: '1',
    name: 'Admin',
    displayName: 'Admin',
    remark: 'Admin',
    isSystem: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: {
            role: {
              create: vi.fn(),
              findMany: vi.fn(),
              count: vi.fn(),
              findUnique: vi.fn(),
              update: vi.fn(),
              delete: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<RoleService>(RoleService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a role', async () => {
      const dto = { name: 'Admin' }
      vi.spyOn(prismaService.role, 'create').mockResolvedValue(mockRole)

      const result = await service.create(dto)
      expect(result).toEqual(mockRole)
      expect(prismaService.role.create).toHaveBeenCalledWith({ data: dto })
    })
  })

  describe('findAll', () => {
    it('should return a list of roles', async () => {
      const dto = { page: 1, limit: 10 }
      const expectedRoles = [mockRole]
      vi.spyOn(prismaService.role, 'findMany').mockResolvedValue(expectedRoles)
      vi.spyOn(prismaService.role, 'count').mockResolvedValue(1)

      const result = await service.findAll(dto)
      expect(result).toEqual({
        items: expectedRoles,
        total: 1,
        page: 1,
        limit: 10,
      })
    })
  })

  describe('findOne', () => {
    it('should return a single role', async () => {
      const id = '1'
      vi.spyOn(prismaService.role, 'findUnique').mockResolvedValue(mockRole)

      const result = await service.findOne(id)
      expect(result).toEqual(mockRole)
      expect(prismaService.role.findUnique).toHaveBeenCalledWith({ where: { id } })
    })
  })

  describe('update', () => {
    it('should update a role', async () => {
      const id = '1'
      const dto = { name: 'Admin' }
      vi.spyOn(prismaService.role, 'update').mockResolvedValue(mockRole)

      const result = await service.update(id, dto)
      expect(result).toEqual(mockRole)
      expect(prismaService.role.update).toHaveBeenCalledWith({ where: { id }, data: dto })
    })
  })

  describe('delete', () => {
    it('should delete a role', async () => {
      const id = '1'
      vi.spyOn(prismaService.role, 'delete').mockResolvedValue(mockRole)

      const result = await service.remove(id)
      expect(result).toEqual(mockRole)
      expect(prismaService.role.delete).toHaveBeenCalledWith({ where: { id } })
    })
  })
})
