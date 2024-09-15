import { type IConfigDto, type IPackageAuthor, TNodeEnv } from '@/types'
import { IsArray, IsBoolean, IsEmail, IsIn, IsInt, IsObject, IsOptional, IsString, IsUrl } from 'class-validator'

export class ConfigDto implements IConfigDto {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: TNodeEnv

  @IsUrl({
    // require top level domain
    require_tld: false,
  })
  NB_BASE_URL: string

  @IsString()
  NB_API_PREFIX: string

  @IsString()
  RESEND_API_KEY: string

  @IsEmail()
  RESEND_FROM: string

  @IsString()
  NB_MAIL_SUBJECT_VERIFY: string

  @IsString()
  DATABASE_URL: string

  @IsString()
  DIRECT_URL: string

  // JWT
  /**
   * JWT Token expiry in seconds
   */
  @IsInt()
  JWT_EXPIRY: number

  @IsString()
  JWT_SECRET: string

  /**
   * JWT Token refresh expiry in seconds
   */
  @IsInt()
  JWT_REFRESH_EXPIRY: number

  @IsString()
  JWT_REFRESH_SECRET: string

  @IsString()
  NB_DEFAULT_ROLE_ID: string

  /**
   * OTP expiry in seconds
   */
  @IsInt()
  NB_OTP_EXPIRY: number

  @IsInt()
  NB_APP_PORT: number

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
  @IsObject()
  author?: IPackageAuthor

  // SMTP
  @IsString()
  NB_SMTP_HOST: string

  @IsInt()
  NB_SMTP_PORT: number

  @IsString()
  NB_SMTP_USER: string

  @IsString()
  NB_SMTP_PASS: string

  @IsBoolean()
  NB_SMTP_SECURE: boolean
}
