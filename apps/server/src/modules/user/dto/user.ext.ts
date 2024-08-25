import { $Enums, Prisma } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiResponseX, IListQueryResult, ListQueryResult } from 'src/common/dto'
import { IRole } from 'src/modules/role/dto'
import { IPermission } from 'src/modules/permission/dto'
import { IResource, ResourceDto } from 'src/modules/resource/dto'
import { KeysOf } from 'src/types'

type TUserSelectScalar = Omit<Prisma.UserSelectScalar, 'password' | 'createdBy' | 'updatedBy'>
/**
 * Public (Non-confidential) user data
 */
type TUser = Prisma.UserGetPayload<{
  select: IUserSelectScalar
}> & IUserExtra

/**
 * User data with confidential information like `password`
 */
type TUserFull = Prisma.UserGetPayload<Prisma.UserDefaultArgs> & IUserExtra

export interface IUserToken {
  accessToken?: string
  refreshToken?: string
  accessTokenExpiredAt?: Date
  refreshTokenExpiredAt?: Date
}

export interface IUserExtra extends IUserToken {
  roles?: IRole[]
  roleNames?: string[]
  permissions?: IPermission[]
  permissionNames?: string[]
  resources?: IResource[]
}

export interface IUserSelectScalar extends TUserSelectScalar {}

/**
 * Public user data
 */
export interface IUser extends TUser {}

/**
 * User data with confidential information like `password`
 */
export interface IUserFull extends TUserFull {}

/**
 * JWT Payload
 */
export interface IUserTokenPayload {
  iss: string
  username: string
  sub: string
}

export type IUserList = IListQueryResult<IUser>

export const UserColumns: IUserSelectScalar = {
  id: true,
  email: true,
  name: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
  emailVerifiedAt: true,
  gender: true,
  birthday: true,
  disabled: true,
  avatar: true,
  online: true,
}
export const UserPublicKeys: Array<KeysOf<TUser>> = Object.keys(UserColumns) as Array<KeysOf<TUser>>
export const UserSchemaKeys: Array<KeysOf<TUserFull>> = [
  'id',
  'email',
  'name',
  'displayName',
  'emailVerifiedAt',
  'birthday',
  'disabled',
  'gender',
  'avatar',
  'online',
  'createdAt',
  'updatedAt',
  'updatedBy',
  'createdBy',
]

// Concrete classes used to generate openapi schema
export class UserTokenDto implements IUserToken {
  @ApiProperty({ description: 'Access token' })
  accessToken?: string

  @ApiProperty({ description: 'Refresh token' })
  refreshToken?: string
}

export class UserDto extends UserTokenDto implements IUser {
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
  emailVerifiedAt: Date

  @ApiProperty({ description: 'User Avatar' })
  avatar: string

  @ApiProperty({ description: 'User Gender' })
  gender: $Enums.TUserGender

  @ApiProperty({ description: 'User status' })
  disabled: boolean

  @ApiProperty({ description: 'User online status' })
  online: boolean

  @ApiProperty({ description: 'User birthday' })
  birthday: Date

  @ApiProperty({ type: [ResourceDto], description: 'List of authorized resources' })
  resources?: ResourceDto[]
}

export class UserListDto extends ListQueryResult<UserDto> implements IUserList {
  @ApiProperty({ type: [UserDto], description: 'List of items' })
  items: UserDto[]
}

export class UserApiResponse extends ApiResponseX<UserDto> {
  @ApiProperty({ type: UserDto })
  data: UserDto
}

export class UserListApiResponse extends ApiResponseX<UserListDto> {
  @ApiProperty({ type: UserListDto })
  data: UserListDto
}
