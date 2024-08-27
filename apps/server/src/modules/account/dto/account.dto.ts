import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { TAccountProvider, TAccountType } from '@nextboard/common'
import type {
  IAccount,
  IAccountList,
  NullOptional,
} from '@nextboard/common'
import { ApiResponse, ListQueryResult } from 'src/common/dto'
import { ApiProperty } from '@nestjs/swagger'

export class AccountDto implements IAccount {
  @IsString()
  id: string

  @IsString()
  userId: string

  @IsEnum(TAccountType)
  type: TAccountType

  @IsEnum(TAccountProvider)
  provider: TAccountProvider

  @IsString()
  providerAccountId: string

  @IsOptional()
  @IsString()
  refreshToken: NullOptional<string>

  @IsOptional()
  @IsString()
  accessToken: NullOptional<string>

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiredAt: NullOptional<Date>

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  refreshExpiredAt: NullOptional<Date>

  @IsOptional()
  @IsString()
  tokenType: NullOptional<string>

  @IsOptional()
  @IsString()
  scope: NullOptional<string>

  @IsOptional()
  @IsString()
  idToken: NullOptional<string>

  @IsDate()
  @Type(() => Date)
  createdAt: Date = new Date()

  @IsDate()
  @Type(() => Date)
  updatedAt: Date = new Date()

  @IsOptional()
  @IsString()
  sessionState: NullOptional<string>
}

export class AccountListDto extends ListQueryResult<AccountDto> implements IAccountList {
  @ApiProperty({ type: [AccountDto], description: 'List of items' })
  items: AccountDto[]
}

export class AccountApiResponse extends ApiResponse<AccountDto> {
  @ApiProperty({ type: AccountDto })
  data: AccountDto
}

export class AccountListApiResponse extends ApiResponse<AccountListDto> {
  @ApiProperty({ type: AccountListDto })
  data: AccountListDto
}
