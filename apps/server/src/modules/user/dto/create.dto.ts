import { Match } from '@/common/decorators/match.decorator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Prisma, TUserGender } from '@xsin/xboard'
import { Type } from 'class-transformer'
import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString, IsUrl, Length, Matches } from 'class-validator'

export class CreateUserDto implements Prisma.UserCreateInput {
  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/, {
    message: 'Password must be 8-20 characters long and contain at least one special character',
  })
  password: string

  @ApiProperty({ description: 'Confirm password' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  password1: string

  @ApiPropertyOptional({ description: 'User name' })
  @IsString()
  @Length(4, 20)
  @IsOptional()
  name?: string | null

  @ApiPropertyOptional({ description: 'User display name' })
  @IsString()
  @Length(4, 20)
  @IsOptional()
  displayName?: string | null

  @ApiPropertyOptional({ description: 'User email verified date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  emailVerifiedAt?: Date | string | null

  @ApiPropertyOptional({ description: 'User online status' })
  @IsOptional()
  @IsBoolean()
  online?: boolean

  @ApiPropertyOptional({ description: 'User last login date' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  loginAt?: Date | string | null

  @ApiPropertyOptional({ description: 'User Avatar' })
  @IsString()
  @IsOptional()
  @IsUrl()
  avatar?: string | null

  @ApiPropertyOptional({ description: 'User Gender' })
  @IsEnum(TUserGender)
  @IsOptional()
  gender?: TUserGender

  @ApiPropertyOptional({ description: 'User Birthday' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  birthday?: Date | string | null
}
