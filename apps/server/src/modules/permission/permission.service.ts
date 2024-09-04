import { Injectable } from '@nestjs/common'
import type { IListQueryDto, IListQueryResult, Permission } from '@nextboard/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePermissionDto } from './dto/create.dto'
import { UpdatePermissionDto } from './dto/update.dto'
import { buildFindManyParams } from '@/common/utils'

@Injectable()
export class PermissionService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreatePermissionDto): Promise<Permission> {
    return this.prismaService.permission.create({
      data: {
        ...dto,
      },
    })
  }

  async findAll(dto: IListQueryDto): Promise<IListQueryResult<Permission>> {
    const findManyParams = buildFindManyParams<Prisma.PermissionFindManyArgs>(dto)

    const items = await this.prismaService.permission.findMany(findManyParams)

    const total = await this.prismaService.permission.count({ where: findManyParams.where })

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
    }
  }

  async findOne(id: string): Promise<Permission> {
    return this.prismaService.permission.findUnique({
      where: {
        id,
      },
    })
  }

  update(id: string, dto: UpdatePermissionDto): Promise<Permission> {
    return this.prismaService.permission.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  remove(id: string): Promise<Permission> {
    return this.prismaService.permission.delete({
      where: {
        id,
      },
    })
  }
}
