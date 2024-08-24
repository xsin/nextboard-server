import { IsDate, IsString } from 'class-validator'

export class CreateTokenDto {
  @IsString()
  owner: string

  @IsString()
  code: string

  @IsDate()
  expiredAt: Date
}
