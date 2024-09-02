import { Injectable } from '@nestjs/common'
import type { IListQueryDto, IListQueryResult, Resource } from '@nextboard/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateResourceDto } from './dto/create.dto'
import { UpdateResourceDto } from './dto/update.dto'
import { buildFindManyParams } from '@/common/utils'

@Injectable()
export class ResourceService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreateResourceDto): Promise<Resource> {
    return this.prismaService.resource.create({
      data: {
        ...dto,
      },
    })
  }

  async findAll(dto: IListQueryDto): Promise<IListQueryResult<Resource>> {
    const findManyParams = buildFindManyParams<Prisma.ResourceFindManyArgs>(dto)

    const items = await this.prismaService.resource.findMany(findManyParams)

    const total = await this.prismaService.resource.count({ where: findManyParams.where })

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
    }
  }

  async findOne(id: string): Promise<Resource> {
    return this.prismaService.resource.findUnique({
      where: {
        id,
      },
    })
  }

  update(id: string, dto: UpdateResourceDto): Promise<Resource> {
    return this.prismaService.resource.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  remove(id: string): Promise<Resource> {
    return this.prismaService.resource.delete({
      where: {
        id,
      },
    })
  }
}
