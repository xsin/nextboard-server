import { IsEmail, IsString, Length, Matches } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  readonly email: string

  @IsString()
  @Matches(/^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/, {
    message: 'Password must be 8-20 characters long and contain at least one special character',
  })
  readonly password: string

  @IsString()
  @Length(4, 20)
  readonly name?: string

  @IsString()
  @Length(4, 20)
  readonly displayName?: string
}
