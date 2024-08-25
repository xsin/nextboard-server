import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { TAccountProvider, TAccountType } from '@prisma/client'

export class CreateAccountDto {
  @IsOptional()
  @IsString()
  userId?: string

  @IsEnum(TAccountType)
  type: TAccountType

  @IsEnum(TAccountProvider)
  provider: TAccountProvider

  @IsString()
  providerAccountId: string

  @IsOptional()
  @IsString()
  refreshToken?: string

  @IsOptional()
  @IsString()
  accessToken?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiredAt?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  refreshExpiredAt?: Date

  @IsOptional()
  @IsString()
  tokenType?: string

  @IsOptional()
  @IsString()
  scope?: string

  @IsOptional()
  @IsString()
  idToken?: string
}
