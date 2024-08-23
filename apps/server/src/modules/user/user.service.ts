import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { saltAndHashPassword } from 'src/common/utils/password'
import { IListQueryDto } from 'src/common/dto'
import { buildFindManyParams } from 'src/common/utils'
import { omit } from 'radash'
import type { Prisma } from '@prisma/client'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma/prisma.service'
import { IResource, IResourceList } from '../resource/dto'
import type {
  CreateUserDto,
  IUser,
  IUserFull,
  IUserList,
  IUserProfile,
  UpdateUserDto,
} from './dto'

import { UserColumns } from './dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const user = await this.findByEmail(createUserDto.email)
    if (user) {
      throw new ConflictException('User already exists')
    }
    const newUser = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await saltAndHashPassword(createUserDto.password),
      },
      select: UserColumns,
    })

    // Send verification email
    await this.mailService.sendVerificationEmail(newUser.email)

    return newUser
  }

  async findAll(dto: IListQueryDto): Promise<IUserList> {
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

  async findOne(id: string): Promise<IUser> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: UserColumns,
    })
  }

  async findByEmail(email: string): Promise<IUser> {
    const item = this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: UserColumns,
    })
    return item
  }

  /**
   * Find the user data, includes user's roles, the permissions and the authorized resources associated with those roles.
   * @param {Prisma.UserWhereUniqueInput} whereArgs - User where unique input
   * @param {boolean} includeResources - Whether to include the authorized resources
   * @returns {Promise<IUserWithRolesPermissionsAndMenus>} user with roles, permissions and visible menus
   */
  async findUser(whereArgs: Prisma.UserWhereUniqueInput, includeResources: boolean = true): Promise<IUserFull> {
    const user = await this.prismaService.user.findUnique({
      where: whereArgs,
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    const userInfo = omit(user, ['roles'])
    const roles = user.roles.map(userRole => userRole.role)
    const roleNames = roles.map(role => role.name)
    const permissions = roles.flatMap(role => role.permissions.map(rolePermission => rolePermission.permission))
    const permissionNames = permissions.map(permission => permission.name)
    const item: IUserFull = {
      ...userInfo,
      roles,
      roleNames,
      permissions,
      permissionNames,
      resources: [],
    }

    if (includeResources) {
      item.resources = await this.parseUserResources(item)
    }

    return item
  }

  /**
   * Find full user data by email. Including the user's roles, password, permissions, and the authorized resources associated with those roles.
   * @param {string} email user's email
   * @param {boolean} includeResources - Whether to include the authorized resources
   * @returns {Promise<IUserFull>} user with roles, password, permissions and the authorized resources
   */
  async findByEmailX(email: string, includeResources: boolean = true): Promise<IUserFull> {
    return this.findUser({ email }, includeResources)
  }

  /**
   * Find full user data by id. Including the user's roles, password, permissions, and the authorized resources associated with those roles.
   * @param {string} id user's id
   * @param {boolean} includeResources - Whether to include the authorized resources
   * @returns {Promise<IUserFull>} user with roles, password, permissions and the authorized resources
   */
  async findByIdX(id: string, includeResources: boolean = true): Promise<IUserFull> {
    return this.findUser({ id }, includeResources)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
      select: UserColumns,
    })
  }

  async remove(id: string): Promise<IUser> {
    return this.prismaService.user.delete({
      where: {
        id,
      },
      select: UserColumns,
    })
  }

  async verifyEmail(email: string): Promise<IUser> {
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
      select: UserColumns,
    })
  }

  /**
   * Get User's resources according to the user's permission and resource's permission
   * @param {string} email - User email
   */
  async findUserResources(email: string): Promise<IResourceList> {
    // Find the user and his/her roles and permissions
    const user = await this.findByEmailX(email)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Calculate user's total permission value on each menu
    const itemsWithPermissions = user.resources ?? []

    return {
      items: itemsWithPermissions,
      total: itemsWithPermissions.length,
      page: 1,
      limit: itemsWithPermissions.length,
    }
  }

  /**
   * Get User's resources according to the user's permission and resource's permission
   * 1. Find users and their roles and permissions: Search for users by their email and include the user's roles and the permissions associated with those roles.
   * 2. Find resources: Look up corresponding resources based on the permissions.
   * @param {IUser} user - User object with roles and permissions
   * @returns {Promise<IResource[]>} List of menus with user's permission code
   */
  private async parseUserResources(user: IUser): Promise<IResource[]> {
    const permissionsOwned = user.permissions ?? []

    // Get the IDs and codes of the filtered permissions
    const permissionIdsOwned = permissionsOwned.map(permission => permission.id)

    // Find the authorized resources
    const itemsViewable = await this.prismaService.resource.findMany({
      where: {
        permissions: {
          some: {
            permissionId: { in: permissionIdsOwned },
          },
        },
      },
    })

    return itemsViewable as IResource[]
  }

  /**
   * Get user's profile by email
   * @param {string} email - User email
   * @returns {Promise<IUserProfile>} User profile
   */
  async getUserProfileByEmail(email: string): Promise<IUserProfile> {
    return this.getUserProfile({ email })
  }

  async getUserProfileById(id: string): Promise<IUserProfile> {
    return this.getUserProfile({ id })
  }

  private async getUserProfile(where: Prisma.UserWhereUniqueInput): Promise<IUserProfile> {
    const userInfo = await this.findUser(where)
    const {
      password,
      online,
      disabled,
      roles,
      permissions,
      ...profile
    } = userInfo
    return profile
  }
}
