import type { IListQueryDto, IListQueryResult, Role } from '@xsin/nextboard-common'
import { buildFindManyParams } from '@/common/utils'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateRoleDto } from './dto/create.dto'
import { UpdateRoleDto } from './dto/update.dto'

@Injectable()
export class RoleService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    return this.prismaService.role.create({
      data: {
        ...dto,
      },
    })
  }

  async findAll(dto: IListQueryDto): Promise<IListQueryResult<Role>> {
    const findManyParams = buildFindManyParams<Prisma.RoleFindManyArgs>(dto)

    const items = await this.prismaService.role.findMany(findManyParams)

    const total = await this.prismaService.role.count({ where: findManyParams.where })

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
    }
  }

  async findOne(id: string): Promise<Role> {
    return this.prismaService.role.findUnique({
      where: {
        id,
      },
    })
  }

  update(id: string, dto: UpdateRoleDto): Promise<Role> {
    return this.prismaService.role.update({
      where: {
        id,
      },
      data: {
        ...dto,
      },
    })
  }

  remove(id: string): Promise<Role> {
    return this.prismaService.role.delete({
      where: {
        id,
      },
    })
  }
}
