import { Prisma, TUserGender } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiResponse, ListQueryResult } from 'src/common/dto'
import { ResourceDto } from 'src/modules/resource/dto'
import { IUser, IUserList, IUserToken, KeysOf } from '@nextboard/common'

type TUserSelectScalar = Omit<Prisma.UserSelectScalar, 'password'>

export interface IUserSelectScalar extends TUserSelectScalar {}

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
  createdBy: true,
  updatedBy: true,
}
export const UserPublicKeys: Array<KeysOf<IUser>> = Object.keys(UserColumns) as Array<KeysOf<IUser>>

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
  gender: TUserGender

  @ApiProperty({ description: 'User status' })
  disabled: boolean

  @ApiProperty({ description: 'User online status' })
  online: boolean

  @ApiProperty({ description: 'User birthday' })
  birthday: Date

  @ApiProperty({ type: [ResourceDto], description: 'List of authorized resources' })
  resources?: ResourceDto[]

  @ApiProperty({ description: 'Created by' })
  createdBy: string

  @ApiProperty({ description: 'Updated by' })
  updatedBy: string
}

export class UserListDto extends ListQueryResult<UserDto> implements IUserList {
  @ApiProperty({ type: [UserDto], description: 'List of items' })
  items: UserDto[]
}

export class UserApiResponse extends ApiResponse<UserDto> {
  @ApiProperty({ type: UserDto })
  data: UserDto
}

export class UserListApiResponse extends ApiResponse<UserListDto> {
  @ApiProperty({ type: UserListDto })
  data: UserListDto
}
