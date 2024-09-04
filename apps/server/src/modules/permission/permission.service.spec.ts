import { Test, TestingModule } from '@nestjs/testing'
import { IListQueryDto, Permission } from '@nextboard/common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PrismaService } from '../prisma/prisma.service'
import { PermissionService } from './permission.service'
import { CreatePermissionDto } from './dto/create.dto'
import { UpdatePermissionDto } from './dto/update.dto'

describe('permissionService', () => {
  let service: PermissionService
  let prismaService: PrismaService
  const mockPermission: Permission = {
    id: '1',
    name: 'test_permission',
    displayName: 'Test Permission',
    remark: 'This is a test permission',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'admin',
    updatedBy: 'admin',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PrismaService,
          useValue: {
            permission: {
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

    service = module.get<PermissionService>(PermissionService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a permission', async () => {
      const dto: CreatePermissionDto = { name: 'test_permission' }
      const expectedResult = {
        ...mockPermission,
        ...dto,
      }
      vi.spyOn(prismaService.permission, 'create').mockResolvedValue(expectedResult)

      const result = await service.create(dto)
      expect(result).toEqual(expectedResult)
      expect(prismaService.permission.create).toHaveBeenCalledWith({ data: dto })
    })
  })

  describe('findAll', () => {
    it('should return a list of permissions', async () => {
      const dto: IListQueryDto = { page: 1, limit: 10 }
      const expectedItems = [mockPermission]
      const expectedResult = { items: expectedItems, total: 1, page: 1, limit: 10 }
      vi.spyOn(prismaService.permission, 'findMany').mockResolvedValue(expectedItems)
      vi.spyOn(prismaService.permission, 'count').mockResolvedValue(1)

      const result = await service.findAll(dto)
      expect(result).toEqual(expectedResult)
      expect(prismaService.permission.findMany).toHaveBeenCalled()
      expect(prismaService.permission.count).toHaveBeenCalled()
    })
  })

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const id = '1'
      vi.spyOn(prismaService.permission, 'findUnique').mockResolvedValue(mockPermission)

      const result = await service.findOne(id)
      expect(result).toEqual(mockPermission)
      expect(prismaService.permission.findUnique).toHaveBeenCalledWith({ where: { id } })
    })
  })

  describe('update', () => {
    it('should update a permission', async () => {
      const id = '1'
      const dto: UpdatePermissionDto = { name: 'updated_permission' }
      const expectedResult = {
        ...mockPermission,
        ...dto,
      }
      vi.spyOn(prismaService.permission, 'update').mockResolvedValue(expectedResult)

      const result = await service.update(id, dto)
      expect(result).toEqual(expectedResult)
      expect(prismaService.permission.update).toHaveBeenCalledWith({
        where: { id },
        data: dto,
      })
    })
  })

  describe('remove', () => {
    it('should remove a permission', async () => {
      const id = '1'
      vi.spyOn(prismaService.permission, 'delete').mockResolvedValue(mockPermission)

      const result = await service.remove(id)
      expect(result).toEqual(mockPermission)
      expect(prismaService.permission.delete).toHaveBeenCalledWith({ where: { id } })
    })
  })
})
