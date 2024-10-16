import type { IUser, IUserToken } from '@xsin/xboard'
import { ResourceDto } from '@/modules/resource/dto/resource.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { KeysOf, Prisma, TUserGender } from '@xsin/xboard'

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
  loginAt: true,
  createdBy: true,
  updatedBy: true,
}
export const UserPublicKeys: Array<KeysOf<IUser>> = Object.keys(UserColumns) as Array<KeysOf<IUser>>

// Concrete classes used to generate openapi schema
export class UserTokenDto implements IUserToken {
  @ApiPropertyOptional({ description: 'Access token' })
  accessToken?: string

  @ApiPropertyOptional({ description: 'Refresh token' })
  refreshToken?: string

  @ApiPropertyOptional({ description: 'Access token expired at' })
  accessTokenExpiredAt?: Date

  @ApiPropertyOptional({ description: 'Refresh token expired at' })
  refreshTokenExpiredAt?: Date
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

  @ApiProperty({ description: 'User last login date' })
  loginAt: Date
}
