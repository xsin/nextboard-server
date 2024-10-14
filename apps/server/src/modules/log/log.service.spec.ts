import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { Log } from '@xsin/xboard'
import { LogService } from './log.service'
import { CreateLogDto } from './dto/create.dto'
import { PrismaService } from '@/modules/prisma/prisma.service'

describe('logService', () => {
  let service: LogService
  let prismaService: PrismaService

  const logDemo: Log = {
    id: 1,
    createdAt: new Date(),
    operation: 'test operation',
    level: 'error',
    isSystem: true,
    userId: '123',
    userEmail: 'test@example.com',
    ip: '127.0.0.1',
    userAgent: 'Test User Agent',
    meta: { key: 'value' },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: PrismaService,
          useValue: {
            log: {
              create: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    service = module.get<LogService>(LogService)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new log entry', async () => {
      const createLogDto: CreateLogDto = {
        operation: 'test operation',
        level: 'info',
        isSystem: false,
      }

      const expectedResult: Log = {
        id: 1,
        createdAt: new Date(),
        operation: createLogDto.operation,
        level: createLogDto.level,
        isSystem: createLogDto.isSystem,
        userAgent: '',
        userId: '',
        userEmail: '',
        ip: '',
        meta: {},
      }

      vi.spyOn(prismaService.log, 'create').mockResolvedValue(expectedResult)

      const result = await service.create(createLogDto)

      expect(result).toEqual(expectedResult)
      expect(prismaService.log.create).toHaveBeenCalledWith({
        data: createLogDto,
      })
    })

    it('should handle optional fields', async () => {
      const createLogDto: CreateLogDto = {
        operation: 'test operation',
        userId: '123',
        userEmail: 'test@example.com',
        ip: '127.0.0.1',
        userAgent: 'Test User Agent',
        level: 'error',
        meta: { key: 'value' },
        isSystem: true,
      }

      vi.spyOn(prismaService.log, 'create').mockResolvedValue(logDemo)

      const result = await service.create(createLogDto)

      expect(result).toEqual(logDemo)
      expect(prismaService.log.create).toHaveBeenCalledWith({
        data: createLogDto,
      })
    })
  })
})
