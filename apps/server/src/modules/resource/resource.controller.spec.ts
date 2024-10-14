import { ListQueryDto } from '@/common/dto'
import { Test, TestingModule } from '@nestjs/testing'
import { TResourceOpenTarget } from '@xsin/xboard'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CreateResourceDto } from './dto/create.dto'
import { ResourceDto } from './dto/resource.dto'
import { UpdateResourceDto } from './dto/update.dto'
import { ResourceController } from './resource.controller'
import { ResourceService } from './resource.service'

describe('resourceController', () => {
  let controller: ResourceController
  let service: ResourceService

  const resourceDemo: ResourceDto = {
    id: '1',
    name: 'test',
    displayName: 'Test Resource',
    url: 'http://example.com',
    icon: 'icon.png',
    visible: true,
    keepAlive: false,
    target: TResourceOpenTarget.internalTab,
    remark: null,
    parentId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourceController],
      providers: [
        {
          provide: ResourceService,
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

    controller = module.get<ResourceController>(ResourceController)
    service = module.get<ResourceService>(ResourceService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should create a new resource entry', async () => {
      const dto: CreateResourceDto = {
        name: 'test',
        displayName: 'Test Resource',
        url: 'http://example.com',
        icon: 'icon.png',
        visible: true,
        keepAlive: false,
        target: TResourceOpenTarget.internalTab,
      }

      vi.spyOn(service, 'create').mockResolvedValue(resourceDemo)

      expect(await controller.create(dto)).toEqual(resourceDemo)
    })
  })

  describe('findAll', () => {
    it('should return a list of resource entries', async () => {
      const dto: ListQueryDto = { page: 1, limit: 10 }
      const result = {
        items: [resourceDemo],
        total: 1,
        page: 1,
        limit: 10,
      }

      vi.spyOn(service, 'findAll').mockResolvedValue(result)

      expect(await controller.findAll(dto)).toEqual(result)
    })
  })

  describe('findOne', () => {
    it('should return a single resource entry', async () => {
      vi.spyOn(service, 'findOne').mockResolvedValue(resourceDemo)

      expect(await controller.findOne('1')).toEqual(resourceDemo)
    })
  })

  describe('update', () => {
    it('should update a resource entry', async () => {
      const dto: UpdateResourceDto = { displayName: 'Updated Resource' }
      const result = {
        ...resourceDemo,
        displayName: dto.displayName ?? '',
      }

      vi.spyOn(service, 'update').mockResolvedValue(result)

      expect(await controller.update('1', dto)).toEqual(result)
    })
  })

  describe('remove', () => {
    it('should remove a resource entry', async () => {
      vi.spyOn(service, 'remove').mockResolvedValue(resourceDemo)

      expect(await controller.remove('1')).toEqual(resourceDemo)
    })
  })
})
