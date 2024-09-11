import { Prisma, TUserGender } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IUser, IUserToken, KeysOf } from '@nextboard/common'
import { ResourceDto } from '@/modules/resource/dto/resource.dto'

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
