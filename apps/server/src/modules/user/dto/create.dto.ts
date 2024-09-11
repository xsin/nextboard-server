import { IsDate, IsEmail, IsOptional, IsString, Length, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Match } from 'src/common/decorators/match.decorator'
import { Prisma } from '@nextboard/common'
import { Type } from 'class-transformer'

export class CreateUserDto implements Prisma.UserCreateInput {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/, {
    message: 'Password must be 8-20 characters long and contain at least one special character',
  })
  readonly password: string

  @ApiProperty({ description: 'Confirm password' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  readonly password1: string

  @ApiPropertyOptional({ description: 'User name' })
  @IsString()
  @Length(4, 20)
  readonly name?: string | null

  @ApiPropertyOptional({ description: 'User display name' })
  @IsString()
  @Length(4, 20)
  readonly displayName?: string | null

  @ApiPropertyOptional({ description: 'User email verified date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  readonly emailVerifiedAt?: Date | string | null
}
