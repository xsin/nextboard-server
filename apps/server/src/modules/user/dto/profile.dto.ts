import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiResponseX } from 'src/common/dto'
import { $Enums } from '@prisma/client'
import { IUser } from './user.ext'

export type TUserProfileExcludeFields = 'roles' | 'permissions' | 'menus' | 'online' | 'disabled'

export interface IUserProfile extends Omit<IUser, TUserProfileExcludeFields> {}

export class UserProfileDto implements IUserProfile {
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

  @ApiProperty({ description: 'User Avatar' })
  avatar: string

  @ApiProperty({ description: 'User Gender' })
  gender: $Enums.TUserGender

  @ApiProperty({ description: 'User Birthday' })
  birthday: Date
}

export class UserProfileApiResponse extends ApiResponseX<UserProfileDto> {
  @ApiProperty({ type: UserProfileDto, description: 'Response data' })
  data: UserProfileDto
}
