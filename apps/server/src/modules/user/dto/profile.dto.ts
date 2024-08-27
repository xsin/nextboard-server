import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiResponse } from 'src/common/dto'
import { TUserGender } from '@prisma/client'
import { IUserProfile } from '@nextboard/common'

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
  emailVerifiedAt: Date

  @ApiProperty({ description: 'User Avatar' })
  avatar: string

  @ApiProperty({ description: 'User Gender' })
  gender: TUserGender

  @ApiProperty({ description: 'User Birthday' })
  birthday: Date
}

export class UserProfileApiResponse extends ApiResponse<UserProfileDto> {
  @ApiProperty({ type: UserProfileDto, description: 'Response data' })
  data: UserProfileDto
}
