import type { EmailType, ISendEmailResult } from '@xsin/nextboard-common'
import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsEmail, IsNumber, IsString } from 'class-validator'

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
