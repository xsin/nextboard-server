import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'
import { CreateRoleDto } from './dto/create.dto'
import { UpdateRoleDto } from './dto/update.dto'
import { RoleDto } from './dto/role.dto'
import { ListQueryDto } from '@/common/dto'

describe('roleController', () => {
  let controller: RoleController
  let service: RoleService

  const mockRoleDto: RoleDto = {
    id: '1',
    name: 'Admin',
    displayName: 'Admin',
    remark: 'Admin',
    isSystem: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [
        {
          provide: RoleService,
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

    controller = module.get<RoleController>(RoleController)
    service = module.get<RoleService>(RoleService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a role', async () => {
      const createRoleDto: CreateRoleDto = { name: 'Admin' }
      vi.spyOn(service, 'create').mockResolvedValue(mockRoleDto)

      const result = await controller.create(createRoleDto)
      expect(result).toBe(mockRoleDto)
      expect(service.create).toHaveBeenCalledWith(createRoleDto)
    })
  })

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const listQueryDto: ListQueryDto = { page: 1, limit: 10 }
      const expectedResult = { items: [mockRoleDto], total: 1, page: 1, limit: 10 }
      vi.spyOn(service, 'findAll').mockResolvedValue(expectedResult)

      const result = await controller.findAll(listQueryDto)
      expect(result).toBe(expectedResult)
      expect(service.findAll).toHaveBeenCalledWith(listQueryDto)
    })
  })

  describe('findOne', () => {
    it('should return a single role', async () => {
      const id = '1'
      vi.spyOn(service, 'findOne').mockResolvedValue(mockRoleDto)

      const result = await controller.findOne(id)
      expect(result).toBe(mockRoleDto)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('should update a role', async () => {
      const id = '1'
      const updateRoleDto: UpdateRoleDto = { name: 'Super Admin' }
      const expectedResult: RoleDto = { ...mockRoleDto, name: 'Super Admin' }
      vi.spyOn(service, 'update').mockResolvedValue(expectedResult)

      const result = await controller.update(id, updateRoleDto)
      expect(result).toBe(expectedResult)
      expect(service.update).toHaveBeenCalledWith(id, updateRoleDto)
    })
  })

  describe('remove', () => {
    it('should remove a role', async () => {
      const id = '1'
      vi.spyOn(service, 'remove').mockResolvedValue(mockRoleDto)

      const result = await controller.remove(id)
      expect(result).toBe(mockRoleDto)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
