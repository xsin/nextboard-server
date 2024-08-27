import { Injectable } from '@nestjs/common'
import { Log } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateLogDto } from './dto/create.dto'

@Injectable()
export class LogService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {}

  async create(createLogDto: CreateLogDto): Promise<Log> {
    return this.prismaService.log.create({
      data: createLogDto,
    })
  }
}
