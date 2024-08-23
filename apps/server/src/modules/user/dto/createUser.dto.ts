import { IsEmail, IsString, Length, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Match } from 'src/common/decorators/match.decorator'

export class CreateUserDto {
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
  readonly name?: string

  @ApiPropertyOptional({ description: 'User display name' })
  @IsString()
  @Length(4, 20)
  readonly displayName?: string
}
