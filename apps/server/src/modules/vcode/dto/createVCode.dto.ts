import { IsDate, IsString } from 'class-validator'

export class CreateVCodeDto {
  @IsString()
  owner: string

  @IsString()
  code: string

  @IsDate()
  expiredAt: Date
}
