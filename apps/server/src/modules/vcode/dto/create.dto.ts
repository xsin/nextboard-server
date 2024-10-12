import { ApiProperty } from '@nestjs/swagger'
import { Prisma } from '@xsin/nextboard-common'
import { IsDate, IsString } from 'class-validator'

export class CreateVCodeDto implements Prisma.VCodeCreateInput {
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
  expiredAt: Date | string
}
