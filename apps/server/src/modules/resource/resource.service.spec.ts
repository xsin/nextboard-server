import { Test, TestingModule } from '@nestjs/testing'
import { IListQueryDto, IListQueryResult, Resource, TResourceOpenTarget } from '@xsin/nextboard-common'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PrismaService } from '../prisma/prisma.service'
import { CreateResourceDto } from './dto/create.dto'
import { UpdateResourceDto } from './dto/update.dto'
import { ResourceService } from './resource.service'

describe('resourceService', () => {
  let service: ResourceService
  let prismaService: PrismaService

  const resourceDemo: Resource = {
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
      providers: [
        ResourceService,
        {
          provide: PrismaService,
          useValue: {
            resource: {
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

    service = module.get<ResourceService>(ResourceService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
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
      const result: Resource = {
        ...resourceDemo,
        name: dto.name,
        displayName: dto.displayName,
        url: dto.url,
        icon: dto.icon,
        visible: dto.visible,
        keepAlive: dto.keepAlive,
        target: dto.target,
      }

      const createSpy = vi.spyOn(prismaService.resource, 'create').mockResolvedValue(result)

      const res = await service.create(dto)

      expect(createSpy).toBeCalledTimes(1)
      expect(createSpy).toBeCalledWith({
        data: {
          ...dto,
        },
      })

      expect(res).toEqual(result)
    })
  })

  describe('findAll', () => {
    it('should return a list of resource entries', async () => {
      const dto: IListQueryDto = { page: 1, limit: 10 }
      const result: IListQueryResult<Resource> = {
        items: [resourceDemo],
        total: 1,
        page: 1,
        limit: 10,
      }

      vi.spyOn(prismaService.resource, 'findMany').mockResolvedValue(result.items)
      vi.spyOn(prismaService.resource, 'count').mockResolvedValue(result.total)

      expect(await service.findAll(dto)).toEqual(result)
    })
  })

  describe('findOne', () => {
    it('should return a single resource entry', async () => {
      vi.spyOn(prismaService.resource, 'findUnique').mockResolvedValue(resourceDemo)

      expect(await service.findOne('1')).toEqual(resourceDemo)
    })
  })

  describe('update', () => {
    it('should update a resource entry', async () => {
      const dto: UpdateResourceDto = { displayName: 'Updated Resource' }
      const result: Resource = {
        ...resourceDemo,
        displayName: dto.displayName ?? '',
      }

      vi.spyOn(prismaService.resource, 'update').mockResolvedValue(result)

      expect(await service.update('1', dto)).toEqual(result)
    })
  })

  describe('remove', () => {
    it('should remove a resource entry', async () => {
      vi.spyOn(prismaService.resource, 'delete').mockResolvedValue(resourceDemo)

      expect(await service.remove('1')).toEqual(resourceDemo)
    })
  })
})
