import { ListQueryDto } from '@/common/dto'
import { Test, TestingModule } from '@nestjs/testing'
import { Permission } from '@xsin/nextboard-common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreatePermissionDto } from './dto/create.dto'
import { PermissionDto } from './dto/permission.dto'
import { UpdatePermissionDto } from './dto/update.dto'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

describe('permissionController', () => {
  let controller: PermissionController
  let service: PermissionService
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
      controllers: [PermissionController],
      providers: [
        {
          provide: PermissionService,
          useValue: {
            create: vi.fn(),
            findAll: vi.fn(),
            findOne: vi.fn(),
            update: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile()

    controller = module.get<PermissionController>(PermissionController)
    service = module.get<PermissionService>(PermissionService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a permission', async () => {
      const dto: CreatePermissionDto = { name: 'test_permission' }
      vi.spyOn(service, 'create').mockResolvedValue(mockPermission)

      const result = await controller.create(dto)
      expect(result).toBe(mockPermission)
      expect(service.create).toHaveBeenCalledWith(dto)
    })
  })

  describe('findAll', () => {
    it('should return an array of permissions', async () => {
      const dto: ListQueryDto = { page: 1, limit: 10 }
      const expectedResult = {
        items: [mockPermission],
        total: 1,
        page: 1,
        limit: 10,
      }
      vi.spyOn(service, 'findAll').mockResolvedValue(expectedResult)

      const result = await controller.findAll(dto)
      expect(result).toBe(expectedResult)
      expect(service.findAll).toHaveBeenCalledWith(dto)
    })
  })

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const id = '1'
      vi.spyOn(service, 'findOne').mockResolvedValue(mockPermission)

      const result = await controller.findOne(id)
      expect(result).toBe(mockPermission)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('should update a permission', async () => {
      const id = '1'
      const dto: UpdatePermissionDto = { name: 'updated_permission' }
      const expectedResult: PermissionDto = { ...mockPermission, name: 'updated_permission' }
      vi.spyOn(service, 'update').mockResolvedValue(expectedResult)

      const result = await controller.update(id, dto)
      expect(result).toBe(expectedResult)
      expect(service.update).toHaveBeenCalledWith(id, dto)
    })
  })

  describe('remove', () => {
    it('should remove a permission', async () => {
      const id = '1'
      vi.spyOn(service, 'remove').mockResolvedValue(mockPermission)

      const result = await controller.remove(id)
      expect(result).toBe(mockPermission)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
