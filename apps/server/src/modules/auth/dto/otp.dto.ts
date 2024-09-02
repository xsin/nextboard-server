import { ApiProperty } from '@nestjs/swagger'
import type { EmailType, ISendEmailResult } from '@nextboard/common'
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator'
import { ApiResponse } from 'src/common/dto'
import { UserDto } from 'src/modules/user/dto'

export class SendOTPRequestDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  readonly email: string
}

export class SendOTPDto implements ISendEmailResult {
  @ApiProperty({
    description: 'Server time when the OTP is sent',
  })
  @IsDate()
  time: Date

  @ApiProperty({
    description: 'Email type',
  })
  @IsString()
  type: EmailType

  @ApiProperty({
    description: 'Validity duration of the OTP in milliseconds',
  })
  @IsNumber()
  duration?: number
}

export class SendOTPApiResponse extends ApiResponse<SendOTPDto> {
  @ApiProperty({ type: SendOTPDto, description: 'Response data' })
  data: SendOTPDto
}

export class OTPLoginDto {
  @ApiProperty({
    description: 'OTP code',
  })
  @IsString()
  code: string

  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  email: string
}

export class OTPLoginApiResponse extends ApiResponse<UserDto> {
  @ApiProperty({ type: UserDto, description: 'Response data' })
  data: UserDto
}
