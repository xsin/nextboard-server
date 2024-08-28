import { Test, TestingModule } from '@nestjs/testing'
import { Dict, IListQueryDto, IListQueryResult } from '@nextboard/common'
import { PrismaService } from '../prisma/prisma.service'
import { DictService } from './dict.service'
import { CreateDictDto } from './dto/create.dto'
import { UpdateDictDto } from './dto/update.dto'

describe('dictService', () => {
  let service: DictService
  let prismaService: PrismaService

  const dictDemo: Dict = {
    id: '1',
    name: 'test',
    content: 'value',
    type: 'string',
    meta: null,
    remark: null,
    displayName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: '1',
    updatedBy: '1',
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DictService,
        {
          provide: PrismaService,
          useValue: {
            dict: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<DictService>(DictService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new dict entry', async () => {
      const dto: CreateDictDto = {
        name: 'test',
        content: 'value',
        type: 'string',
      }
      const result: Dict = {
        id: '1',
        name: dto.name,
        content: dto.content,
        type: dto.type,
        displayName: dto.displayName ?? null,
        meta: dto.meta ?? null,
        remark: dto.remark ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1',
        updatedBy: '1',
      }

      jest.spyOn(prismaService.dict, 'create').mockResolvedValue(result)

      expect(await service.create(dto)).toEqual(result)
    })
  })

  describe('findAll', () => {
    it('should return a list of dict entries', async () => {
      const dto: IListQueryDto = { page: 1, limit: 10 }
      const result: IListQueryResult<Dict> = {
        items: [dictDemo],
        total: 1,
        page: 1,
        limit: 10,
      }

      jest.spyOn(prismaService.dict, 'findMany').mockResolvedValue(result.items)
      jest.spyOn(prismaService.dict, 'count').mockResolvedValue(result.total)

      expect(await service.findAll(dto)).toEqual(result)
    })
  })

  describe('findOne', () => {
    it('should return a single dict entry', async () => {
      jest.spyOn(prismaService.dict, 'findUnique').mockResolvedValue(dictDemo)

      expect(await service.findOne('1')).toEqual(dictDemo)
    })
  })

  describe('update', () => {
    it('should update a dict entry', async () => {
      const dto: UpdateDictDto = { content: 'new value' }
      const result: Dict = {
        ...dictDemo,
        content: dto.content ?? '',
      }

      jest.spyOn(prismaService.dict, 'update').mockResolvedValue(result)

      expect(await service.update('1', dto)).toEqual(result)
    })
  })

  describe('remove', () => {
    it('should remove a dict entry', async () => {
      jest.spyOn(prismaService.dict, 'delete').mockResolvedValue(dictDemo)

      expect(await service.remove('1')).toEqual(dictDemo)
    })
  })
})
