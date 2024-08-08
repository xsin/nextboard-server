import { Prisma } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiResponseX, IListQueryResult, ListQueryResult } from 'src/common/dto'
import { IRole } from 'src/modules/role/dto'
import { IPermission } from 'src/modules/permission/dto'
import { IMenu, MenuQueryDto } from 'src/modules/menu/dto'
import { KeysOf } from 'src/types'

export * from './create-user.dto'
export * from './update-user.dto'

type TUserSelectScalarSafe = Pick<Prisma.UserSelectScalar, 'id' | 'email' | 'name' | 'displayName' | 'createdAt' | 'updatedAt' | 'emailVerified'>
type TUserQueryDto = Prisma.UserGetPayload<{
  select: IUserSelectScalarSafe
}>
type TUser = Prisma.UserGetPayload<Prisma.UserDefaultArgs>

type TUserWithTokensAndMenus = TUserQueryDto & IUserToken & {
  menus: IMenu[]
}
type TUserX = TUser & {
  roleNames: string[]
  permissionNames: string[]
  roles: IRole[]
  permissions: IPermission[]
  menus: IMenu[]
}

export interface IUserToken {
  accessToken: string
  refreshToken: string
}

export interface IUserSelectScalarSafe extends TUserSelectScalarSafe {}

export interface IUserQueryDto extends TUserQueryDto {}

export interface IUser extends TUser {}

export interface IUserWithTokensAndMenus extends TUserWithTokensAndMenus {}

export interface IUserTokenPayload {
  iss: string
  username: string
  sub: string
  roles: string[]
  permissions: string[]
}

/**
 * User with roles, permissions and visible menus
 */
export interface IUserX extends TUserX {}

export type IUserListQueryDto = IListQueryResult<IUserQueryDto>

export const UserQueryColumns: IUserSelectScalarSafe = {
  id: true,
  email: true,
  name: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
  emailVerified: true,
}
export const UserQueryDtoKeys: Array<KeysOf<TUser>> = Object.keys(UserQueryColumns) as Array<KeysOf<TUser>>
export const UserSchemaKeys: Array<KeysOf<TUser>> = [
  'id',
  'email',
  'name',
  'displayName',
  'emailVerified',
  'birthday',
  'disabled',
  'gender',
  'image',
  'online',
  'createdAt',
  'updatedAt',
  'updatedBy',
  'createdBy',
]

// Concrete classes used to generate openapi schema
export class UserQueryDto implements IUserQueryDto {
  @ApiProperty({ description: 'User ID' })
  id: string

  @ApiProperty({ description: 'Email address' })
  email: string

  @ApiPropertyOptional({ description: 'User name' })
  name: string

  @ApiPropertyOptional({ description: 'User display name' })
  displayName: string

  @ApiProperty({ description: 'User creation date' })
  createdAt: Date

  @ApiProperty({ description: 'User last update date' })
  updatedAt: Date

  @ApiPropertyOptional({ description: 'User email verified date' })
  emailVerified: Date
}

export class UserWithTokensAndMenusDto extends UserQueryDto implements IUserWithTokensAndMenus {
  @ApiProperty({ description: 'Access token' })
  accessToken: string

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string

  @ApiProperty({ type: [MenuQueryDto], description: 'List of visible menus' })
  menus: MenuQueryDto[]
}

export class UserListQueryDto extends ListQueryResult<UserQueryDto> implements IUserListQueryDto {
  @ApiProperty({ type: [UserQueryDto], description: 'List of items' })
  items: UserQueryDto[]
}

export class UserQueryResponse extends ApiResponseX<UserQueryDto> {
  @ApiProperty({ type: UserQueryDto })
  data: UserQueryDto
}

export class UserListQueryResponse extends ApiResponseX<UserListQueryDto> {
  @ApiProperty({ type: UserListQueryDto })
  data: UserListQueryDto
}

export class UserTokenDto implements IUserToken {
  @ApiProperty({ description: 'Access token' })
  accessToken: string

  @ApiProperty({ description: 'Refresh token' })
  refreshToken: string
}
