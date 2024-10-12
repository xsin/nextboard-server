import type { Dict, IListQueryDto, IListQueryResult } from '@xsin/nextboard-common'
import { buildFindManyParams } from '@/common/utils'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateDictDto } from './dto/create.dto'
import { UpdateDictDto } from './dto/update.dto'

@Injectable()
export class DictService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreateDictDto): Promise<Dict> {
    return this.prismaService.dict.create({
      data: {
        ...dto,
      },
    })
  }

  async findAll(dto: IListQueryDto): Promise<IListQueryResult<Dict>> {
    const findManyParams = buildFindManyParams<Prisma.DictFindManyArgs>(dto)

    const items = await this.prismaService.dict.findMany(findManyParams)

    const total = await this.prismaService.dict.count({ where: findManyParams.where })

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
    }
  }

  async findOne(id: string): Promise<Dict> {
    return this.prismaService.dict.findUnique({
      where: {
        id,
      },
    })
  }

  update(id: string, dto: UpdateDictDto): Promise<Dict> {
    return this.prismaService.dict.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  remove(id: string): Promise<Dict> {
    return this.prismaService.dict.delete({
      where: {
        id,
      },
    })
  }
}
