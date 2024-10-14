import type {
  Account,
  IListQueryDto,
  IListQueryResult,
  TAccountProvider,
} from '@xsin/xboard'
import { buildFindManyParams } from '@/common/utils'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@xsin/xboard'
import { omit } from 'radash'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateAccountDto } from './dto/update.dto'

@Injectable()
export class AccountService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async update(provider: TAccountProvider, providerAccountId: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
    const data = omit(updateAccountDto, ['provider', 'providerAccountId'])

    return this.prismaService.account.update({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      data,
    })
  }

  async findAll(dto: IListQueryDto): Promise<IListQueryResult<Account>> {
    const findManyParams = buildFindManyParams<Prisma.AccountFindManyArgs>(dto)

    const items = await this.prismaService.account.findMany(findManyParams)

    const total = await this.prismaService.account.count({ where: findManyParams.where })

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
    }
  }
}
