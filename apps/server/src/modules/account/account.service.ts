import { Injectable } from '@nestjs/common'
import { Account, TAccountProvider } from '@prisma/client'
import { omit } from 'radash'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateAccountDto } from './dto/update-account.dto'

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
}
