import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma.service'
import { saltAndHashPassword } from 'src/common/utils/password'
import { IListQueryDto } from 'src/common/dto'
import { buildFindManyParams } from 'src/common/utils'
import { MailService } from '../mail/mail.service'
import type {
  CreateUserDto,
  IUser,
  IUserListQueryDto,
  IUserQueryDto,
  UpdateUserDto,
} from './dto'

import { UserQueryColumns } from './dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUserQueryDto> {
    const user = await this.findByEmail(createUserDto.email)
    if (user) {
      throw new ConflictException('User already exists')
    }
    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await saltAndHashPassword(createUserDto.password),
      },
      select: UserQueryColumns,
    })

    // Send verification email
    await this.mailService.sendVerificationEmail(newUser.email)

    return newUser
  }

  async findAll(dto: IListQueryDto): Promise<IUserListQueryDto> {
    const findManyParams = buildFindManyParams<IUser>(dto)

    const items = await this.prismaService.user.findMany(findManyParams)

    const total = await this.prismaService.user.count({ where: findManyParams.where })

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
    }
  }

  async findOne(id: string): Promise<IUserQueryDto> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: UserQueryColumns,
    })
  }

  private async findByEmail(email: string): Promise<IUserQueryDto> {
    const item = this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
    return item
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUserQueryDto> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: UserQueryColumns,
    })
  }

  async remove(id: string): Promise<IUserQueryDto> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
      select: UserQueryColumns,
    })
  }

  async verifyEmail(email: string): Promise<IUserQueryDto> {
    const user = await this.findByEmail(email)
    if (!user) {
      throw new ConflictException('User not found')
    }

    // Whether is already verified
    if (user.emailVerified) {
      return user
    }

    return this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
      select: UserQueryColumns,
    })
  }
}
