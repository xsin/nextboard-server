import type { VCode } from '@xsin/nextboard-common'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateVCodeDto } from './dto/create.dto'
import { QueryVCodeDto } from './dto/query.dto'

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

  /**
   * Check if the user(email) has a valid verification code
   * @param {QueryVCodeDto} dto - Query object
   * @returns {Promise<boolean>} True if the user has a valid code
   */
  async hasValidCode(dto: QueryVCodeDto): Promise<boolean> {
    const token = await this.prisma.vCode.findFirst({
      where: {
        owner: dto.owner,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (!token) {
      return false
    }
    return token.expiredAt.getTime() > Date.now()
  }

  /**
   * Check if the user(email) has a valid verification code within the resend interval
   * @param {QueryVCodeDto} dto - Query object
   * @param {number} resendInterval - Resend interval in seconds
   * @returns {Promise<boolean>} True if the user has a valid code within the resend interval
   */
  async hasCodeWithinResendInterval(dto: QueryVCodeDto, resendInterval: number): Promise<boolean> {
    const token = await this.prisma.vCode.findFirst({
      where: {
        owner: dto.owner,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (!token) {
      return false
    }
    return token.createdAt.getTime() > Date.now() - resendInterval * 1000
  }

  generateOwner(owner: string, suffix?: string): string {
    if (!suffix)
      return owner
    return `${owner}:${suffix}`
  }
}
