import { IsArray, IsEmail, IsIn, IsInt, IsOptional, IsString, IsUrl } from 'class-validator'

export interface IConfigDto {

  NODE_ENV: 'development' | 'production' | 'test'

  BASE_URL: string

  API_PREFIX: string

  RESEND_API_KEY: string

  RESEND_FROM: string

  RESEND_VERIFY_MAIL_SUBJECT: string

  DATABASE_URL: string

  DIRECT_URL: string

  // JWT
  /**
   * JWT Token expiry in seconds
   */
  JWT_TOKEN_EXPIRY: number

  JWT_TOKEN_SECRET: string

  /**
   * JWT Token refresh expiry in seconds
   */
  JWT_TOKEN_REFRESH_EXPIRY: number

  JWT_TOKEN_REFRESH_SECRET: string

  DEFAULT_ROLE_ID: string

  /**
   * OTP expiry in seconds
   */
  OTP_EXPIRY: number

  // package.json
  name?: string

  description?: string

  keywords?: string[]

  version?: string

  author?: string
}

export class ConfigDto implements IConfigDto {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test'

  @IsUrl({
    // require top level domain
    require_tld: false,
  })
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
  /**
   * JWT Token expiry in seconds
   */
  @IsInt()
  JWT_TOKEN_EXPIRY: number

  @IsString()
  JWT_TOKEN_SECRET: string

  /**
   * JWT Token refresh expiry in seconds
   */
  @IsInt()
  JWT_TOKEN_REFRESH_EXPIRY: number

  @IsString()
  JWT_TOKEN_REFRESH_SECRET: string

  @IsString()
  DEFAULT_ROLE_ID: string

  /**
   * OTP expiry in seconds
   */
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
