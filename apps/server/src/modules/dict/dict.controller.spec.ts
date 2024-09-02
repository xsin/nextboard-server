import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DictController } from './dict.controller'
import { DictService } from './dict.service'
import { CreateDictDto } from './dto/create.dto'
import { UpdateDictDto } from './dto/update.dto'
import { DictDto } from './dto/dict.dto'
import { ListQueryDto } from '@/common/dto'

describe('dictController', () => {
  let controller: DictController
  let service: DictService

  const mockDictService = {
    create: vi.fn(),
    findAll: vi.fn(),
    findOne: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictController],
      providers: [
        {
          provide: DictService,
          useValue: mockDictService,
        },
      ],
    }).compile()

    controller = module.get<DictController>(DictController)
    service = module.get<DictService>(DictService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new dict entry', async () => {
      const createDto: CreateDictDto = { name: 'Test', content: 'Test content', type: 'Test type' }
      const expectedResult: DictDto = { id: '1', ...createDto, displayName: null, meta: null, remark: null, createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null }

      mockDictService.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createDto)
      expect(result).toEqual(expectedResult)
      expect(service.create).toHaveBeenCalledWith(createDto)
    })
  })

  describe('findAll', () => {
    it('should return all dict entries', async () => {
      const queryDto: ListQueryDto = { page: 1, limit: 10 }
      const expectedResult = { items: [], total: 0, page: 1, limit: 10 }

      mockDictService.findAll.mockResolvedValue(expectedResult)

      const result = await controller.findAll(queryDto)
      expect(result).toEqual(expectedResult)
      expect(service.findAll).toHaveBeenCalledWith(queryDto)
    })
  })

  describe('findOne', () => {
    it('should return a single dict entry', async () => {
      const id = '1'
      const expectedResult: DictDto = { id, name: 'Test', content: 'Test content', type: 'Test type', displayName: null, meta: null, remark: null, createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null }

      mockDictService.findOne.mockResolvedValue(expectedResult)

      const result = await controller.findOne(id)
      expect(result).toEqual(expectedResult)
      expect(service.findOne).toHaveBeenCalledWith(id)
    })
  })

  describe('update', () => {
    it('should update a dict entry', async () => {
      const id = '1'
      const updateDto: UpdateDictDto = { name: 'Updated Test' }
      const expectedResult: DictDto = { id, name: 'Updated Test', content: 'Test content', type: 'Test type', displayName: null, meta: null, remark: null, createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null }

      mockDictService.update.mockResolvedValue(expectedResult)

      const result = await controller.update(id, updateDto)
      expect(result).toEqual(expectedResult)
      expect(service.update).toHaveBeenCalledWith(id, updateDto)
    })
  })

  describe('remove', () => {
    it('should remove a dict entry', async () => {
      const id = '1'
      const expectedResult: DictDto = { id, name: 'Test', content: 'Test content', type: 'Test type', displayName: null, meta: null, remark: null, createdAt: new Date(), updatedAt: new Date(), createdBy: null, updatedBy: null }

      mockDictService.remove.mockResolvedValue(expectedResult)

      const result = await controller.remove(id)
      expect(result).toEqual(expectedResult)
      expect(service.remove).toHaveBeenCalledWith(id)
    })
  })
})
