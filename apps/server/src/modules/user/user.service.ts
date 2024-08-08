import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { saltAndHashPassword } from 'src/common/utils/password'
import { IListQueryDto } from 'src/common/dto'
import { buildFindManyParams } from 'src/common/utils'
import { omit, pick } from 'radash'
import { MailService } from '../mail/mail.service'
import { PrismaService } from '../prisma/prisma.service'
import { IMenu, IMenuListQueryDto } from '../menu/dto'
import type {
  CreateUserDto,
  IUser,
  IUserListQueryDto,
  IUserQueryDto,
  IUserX,
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

  async findByEmail(email: string): Promise<IUserQueryDto> {
    const item = this.prismaService.user.findUnique({
      where: {
        email,
      },
      select: UserQueryColumns,
    })
    return item
  }

  /**
   * Find the user by email and include the user's roles, the permissions and the visible menus associated with those roles.
   * @param {string} email user's email
   * @returns {Promise<IUserX>} user with roles, permissions and visible menus
   */
  async findByEmailX(email: string): Promise<IUserX> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
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
    const item: IUserX = {
      ...userInfo,
      roleNames,
      permissionNames,
      roles,
      permissions,
      menus: [],
    }

    item.menus = await this.getUerMenus(item)

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

  /**
   * Get User's menus according to the user's permission and menu's permission
   * @param {string} email - User email
   */
  async findUserMenus(email: string): Promise<IMenuListQueryDto> {
    // Find the user and his/her roles and permissions
    const user = await this.findByEmailX(email)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    // Calculate user's total permission value on each menu
    const menusWithPermissions = user.menus

    return {
      items: menusWithPermissions,
      total: menusWithPermissions.length,
      page: 1,
      limit: menusWithPermissions.length,
    }
  }

  /**
   * Get User's menus according to the user's permission and menu's permission
   * 1. Find users and their roles and permissions: Search for users by their email and include the user's roles and the permissions associated with those roles.
   * 2. Filter permissions: Select permissions that end with the suffix ".select".
   * 3. Find menus: Look up corresponding menus based on the filtered permissions.
   * 4. Calculate user's total permission value on each menu and assign it to userPermissionCode field.
   * @param {IUserX} user - User object with roles and permissions
   * @returns {Promise<IMenu[]>} List of menus with user's permission code
   */
  private async getUerMenus(user: IUserX): Promise<IMenu[]> {
    // Filter readonly permissions, which end with ".select"
    const readonlyPermissions = user.permissions.filter(item =>
      item.name.endsWith('.select'),
    )

    // Get the IDs and codes of the filtered permissions
    const permissionIdsReadonly = readonlyPermissions.map(permission => permission.id)
    const permissionIdsAll = user.permissions.map(permission => permission.id)

    // Find the menus that correspond to the filtered permissions
    const menusViewable = await this.prismaService.menu.findMany({
      where: {
        permissions: {
          some: {
            permissionId: { in: permissionIdsReadonly },
          },
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    // Calculate user's total permission value on each menu
    const menusWithPermissions = menusViewable.map((menu) => {
      const menuPermissions = menu.permissions.map(item => item.permission)
      const menuPermissionCodes = menuPermissions
        .filter(item => permissionIdsAll.includes(item.id))
        .map(item => item.code)

      const userPermissionCode = menuPermissionCodes.reduce((acc, code) => acc | code, 0)

      return {
        ...omit(menu, ['permissions']),
        userPermissionCode,
      }
    })

    return menusWithPermissions
  }
}
