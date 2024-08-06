import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma.service'
import { Prisma } from '@prisma/client'
import { saltAndHashPassword } from 'src/common/utils/password'
import { ListQueryDto } from 'src/common/dto'
import { MailService } from '../mail/mail.service'
import type {
  CreateUserDto,
  UpdateUserDto,
  UserListQueryReturnType,
  UserQueryReturnDto,
  UserQueryReturnType,
} from './dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): UserQueryReturnType {
    const user = await this.findByEmail(createUserDto.email)
    if (user) {
      throw new ConflictException('User already exists')
    }
    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await saltAndHashPassword(createUserDto.password),
      },
    })

    // Send verification email
    await this.mailService.sendVerificationEmail(newUser.email)

    return newUser as UserQueryReturnDto
  }

  async findAll(dto: ListQueryDto): Promise<UserListQueryReturnType> {
    const { page = 1, limit = 10, orders, search, filters = {} } = dto
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search } },
                { displayName: { contains: search } },
                { email: { contains: search } },
              ],
            }
          : {},
        filters,
      ],
    }

    const orderBy = orders?.map(order => ({ [order.field]: order.direction })) || []

    const users = await this.prismaService.user.findMany({
      where,
      take: limit,
      skip,
      orderBy,
    })

    const total = await this.prismaService.user.count({ where })

    return {
      items: users,
      total,
      page,
      limit,
    }
  }

  async findOne(id: string): UserQueryReturnType {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    }) as UserQueryReturnType
  }

  private async findByEmail(email: string): Promise<Prisma.UserGetPayload<Prisma.UserDefaultArgs>> {
    const item = this.prismaService.user.findUnique({
      where: {
        email,
      },
    })
    return item
  }

  async update(id: string, updateUserDto: UpdateUserDto): UserQueryReturnType {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    }) as UserQueryReturnType
  }

  async remove(id: string): UserQueryReturnType {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    }) as UserQueryReturnType
  }

  async verifyEmail(email: string): UserQueryReturnType {
    const user = await this.findByEmail(email)
    if (!user) {
      throw new ConflictException('User not found')
    }

    // Whether is already verified
    if (user.emailVerified) {
      return user as UserQueryReturnDto
    }

    return this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    }) as UserQueryReturnType
  }
}
