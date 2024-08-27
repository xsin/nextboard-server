import { IsEmail, IsString, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { ApiResponse } from 'src/common/dto'
import { UserDto, UserTokenDto } from 'src/modules/user/dto'

export class LoginRequestDto {
  @ApiProperty({ description: 'Username. In NextBoard, we use email for the username parameter.' })
  @IsEmail()
  readonly username: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/, {
    message: 'Password must be 8-20 characters long and contain at least one special character',
  })
  readonly password: string
}

export class RefreshTokenRequestDto {
  @ApiProperty({ description: 'Refresh token' })
  @IsString()
  readonly refreshToken: string
}

export class RefreshTokenApiResponse extends ApiResponse<UserTokenDto> {
  @ApiProperty({ type: UserTokenDto, description: 'Response data' })
  data: UserTokenDto
}

export class LoginApiResponse extends ApiResponse<UserDto> {
  @ApiProperty({ type: UserDto, description: 'Response data' })
  data: UserDto
}
