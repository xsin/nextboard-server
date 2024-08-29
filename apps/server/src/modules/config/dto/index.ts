import { IsArray, IsEmail, IsIn, IsInt, IsObject, IsOptional, IsString, IsUrl } from 'class-validator'

export interface IPackageAuthor {
  name: string
  email?: string
  url?: string
}

export interface IPackageInfo {
  name?: string

  description?: string

  keywords?: string[]

  version?: string

  author?: IPackageAuthor
}

export type TNodeEnv = 'development' | 'production' | 'test'

export interface IConfigDto extends IPackageInfo {

  NODE_ENV: TNodeEnv

  NB_BASE_URL: string

  NB_API_PREFIX: string

  RESEND_API_KEY: string

  RESEND_FROM: string

  RESEND_VERIFY_MAIL_SUBJECT: string

  DATABASE_URL: string

  DIRECT_URL: string

  // JWT
  /**
   * JWT Token expiry in seconds
   */
  JWT_EXPIRY: number

  JWT_SECRET: string

  /**
   * JWT Token refresh expiry in seconds
   */
  JWT_REFRESH_EXPIRY: number

  JWT_REFRESH_SECRET: string

  NB_DEFAULT_ROLE_ID: string

  /**
   * OTP expiry in seconds
   */
  NB_OTP_EXPIRY: number

  NB_APP_PORT: number

}

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
