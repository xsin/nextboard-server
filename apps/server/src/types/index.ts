export * from './env'
export * from './mail'

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

  NB_MAIL_SUBJECT_VERIFY: string

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

  NB_SMTP_HOST: string
  NB_SMTP_PORT: number
  NB_SMTP_USER: string
  NB_SMTP_PASS: string
  NB_SMTP_SECURE: boolean

  NB_MAIL_VERIFY_EXPIRY: number

  NB_BRAND_NAME: string

}
