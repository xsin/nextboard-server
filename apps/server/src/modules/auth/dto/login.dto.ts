import { ApiProperty } from '@nestjs/swagger'
import { NBError } from '@nextboard/common'
import { IsEmail, IsString, Matches } from 'class-validator'

export class LoginRequestDto {
  @ApiProperty({ description: 'Username. In NextBoard, we use email for the username parameter.' })
  @IsEmail()
  readonly username: string

  @ApiProperty({ description: 'Password. Must be 8-20 characters long and contain at least one special character' })
  @IsString()
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/, {
    message: NBError.AUTH_INVALID_PWD,
  })
  readonly password: string
}

export class RefreshTokenRequestDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  readonly refreshToken: string
}
