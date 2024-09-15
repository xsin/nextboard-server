import { ApiProperty } from '@nestjs/swagger'
import { Prisma, TAccountProvider, TAccountType } from '@nextboard/common'
import { Type } from 'class-transformer'
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateAccountDto implements Prisma.AccountCreateWithoutUserInput {
  @ApiProperty({
    description: 'Account type',
  })
  @IsEnum(TAccountType)
  type: TAccountType

  @ApiProperty({
    description: 'Account provider',
  })
  @IsEnum(TAccountProvider)
  provider: TAccountProvider

  @ApiProperty({
    description: 'Provider Account id',
  })
  @IsString()
  providerAccountId: string

  @ApiProperty({
    description: 'Refresh token',
  })
  @IsString()
  @IsOptional()
  refreshToken?: string

  @ApiProperty({
    description: 'Access token',
  })
  @IsString()
  @IsOptional()
  accessToken?: string

  @ApiProperty({
    description: 'Expired at',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiredAt?: Date | string | null

  @ApiProperty({
    description: 'Refresh expired at',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  refreshExpiredAt?: string | Date | null

  @ApiProperty({
    description: 'Token type',
  })
  @IsString()
  @IsOptional()
  tokenType?: string | null

  @ApiProperty({
    description: 'Scope',
  })
  @IsString()
  @IsOptional()
  scope?: string | null

  @ApiProperty({
    description: 'Id token',
  })
  @IsString()
  @IsOptional()
  idToken?: string | null

  @ApiProperty({
    description: 'Session state',
  })
  @IsString()
  @IsOptional()
  sessionState?: string | null
}
