import { Injectable } from '@nestjs/common'
import type { VCode } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateVCodeDto } from './dto/createVCode.dto'
import { QueryVCodeDto } from './dto/queryVCode.dto'

@Injectable()
export class VCodeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVCodeDto): Promise<VCode> {
    return this.prisma.vCode.create({
      data: {
        ...dto,
      },
    })
  }

  async find(dto: QueryVCodeDto): Promise<VCode | null> {
    return this.prisma.vCode.findUnique({
      where: {
        owner_code: {
          owner: dto.owner,
          code: dto.code,
        },
      },
    })
  }

  async delete(dto: QueryVCodeDto): Promise<VCode> {
    return this.prisma.vCode.delete({
      where: {
        owner_code: {
          owner: dto.owner,
          code: dto.code,
        },
      },
    })
  }

  /**
   * Verify code's validity
   * @param dto
   */
  async verify(dto: QueryVCodeDto): Promise<boolean> {
    const token = await this.find(dto)
    if (!token) {
      return false
    }
    return token.expiredAt.getTime() > Date.now()
  }
}
