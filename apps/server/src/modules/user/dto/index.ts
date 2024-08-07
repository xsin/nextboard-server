import { Prisma } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ApiResponseX, IListQueryResult, ListQueryResult } from 'src/common/dto'

export * from './create-user.dto'
export * from './update-user.dto'

export type IUserSelectScalarSafe = Pick<Prisma.UserSelectScalar, 'id' | 'email' | 'name' | 'displayName' | 'createdAt' | 'updatedAt' | 'emailVerified'>

export type IUserQueryDto = Prisma.UserGetPayload<{
  select: IUserSelectScalarSafe
}>

export type IUser = Prisma.UserGetPayload<Prisma.UserDefaultArgs>

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
