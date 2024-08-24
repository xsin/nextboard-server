import { IsArray, IsEmail, IsIn, IsInt, IsOptional, IsString, IsUrl } from 'class-validator'

export class ConfigDto {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string

  @IsUrl()
  BASE_URL: string

  @IsString()
  API_PREFIX: string

  @IsString()
  RESEND_API_KEY: string

  @IsEmail()
  RESEND_FROM: string

  @IsString()
  RESEND_VERIFY_MAIL_SUBJECT: string

  @IsString()
  DATABASE_URL: string

  @IsString()
  DIRECT_URL: string

  // JWT
  @IsString()
  JWT_TOKEN_EXPIRY: string

  @IsString()
  JWT_TOKEN_SECRET: string

  @IsString()
  JWT_TOKEN_REFRESH_EXPIRY: string

  @IsString()
  JWT_TOKEN_REFRESH_SECRET: string

  @IsInt()
  OTP_EXPIRY: number

  // package.json
  @IsString()
  @IsOptional()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsArray()
  keywords?: string[]

  @IsOptional()
  @IsString()
  version?: string

  @IsOptional()
  @IsString()
  author?: string
}
