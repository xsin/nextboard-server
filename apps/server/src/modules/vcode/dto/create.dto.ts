import { ApiProperty } from '@nestjs/swagger'
import { ICreateVCodeDto } from '@nextboard/common'
import { IsDate, IsString } from 'class-validator'

export class CreateVCodeDto implements ICreateVCodeDto {
  @ApiProperty({
    description: 'Owner of the verification code',
  })
  @IsString()
  owner: string

  @ApiProperty({
    description: 'Verification code',
  })
  @IsString()
  code: string

  @ApiProperty({
    description: 'Verification code expiration date',
  })
  @IsDate()
  expiredAt: Date
}
