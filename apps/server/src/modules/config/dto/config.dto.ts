import { IsArray, IsEmail, IsIn, IsInt, IsObject, IsOptional, IsString, IsUrl } from 'class-validator'
import { type IConfigDto, type IPackageAuthor, TNodeEnv } from '@/types'

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
  RESEND_VERIFY_MAIL_SUBJECT: string

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
}
