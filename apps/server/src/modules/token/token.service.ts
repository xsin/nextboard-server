import { Injectable } from '@nestjs/common'
import type { Token } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateTokenDto } from './dto/createToken.dto'
import { QueryTokenDto } from './dto/queryToken.dto'

@Injectable()
export class TokenService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTokenDto): Promise<Token> {
    return this.prisma.token.create({
      data: {
        ...dto,
      },
    })
  }

  async find(dto: QueryTokenDto): Promise<Token | null> {
    return this.prisma.token.findUnique({
      where: {
        owner_code: {
          owner: dto.owner,
          code: dto.code,
        },
      },
    })
  }

  async delete(dto: QueryTokenDto): Promise<Token> {
    return this.prisma.token.delete({
      where: {
        owner_code: {
          owner: dto.owner,
          code: dto.code,
        },
      },
    })
  }

  /**
   * Verify token's validity
   * @param dto
   */
  async verify(dto: QueryTokenDto): Promise<boolean> {
    const token = await this.find(dto)
    if (!token) {
      return false
    }
    return token.expiredAt.getTime() > Date.now()
  }
}
