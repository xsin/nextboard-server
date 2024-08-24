export const C_DATABASE_URL = 'DATABASE_URL'
export const C_DIRECT_URL = 'DIRECT_URL'
export const C_RESEND_API_KEY = 'RESEND_API_KEY'
export const C_RESEND_FROM = 'RESEND_FROM'
export const C_RESEND_VERIFY_MAIL_SUBJECT = 'RESEND_VERIFY_MAIL_SUBJECT'
export const C_JWT_EXPIRY = 'JWT_EXPIRY'
export const C_JWT_SECRET = 'JWT_SECRET'
export const C_JWT_REFRESH_EXPIRY = 'JWT_REFRESH_EXPIRY'
export const C_JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET'
export const C_OTP_EXPIRY = 'OTP_EXPIRY'
export const C_API_PREFIX = 'API_PREFIX'
export const C_NODE_ENV = 'NODE_ENV'
export const C_BASE_URL = 'BASE_URL'

export interface Env {
  [C_DATABASE_URL]: string
  [C_DIRECT_URL]: string
  [C_RESEND_API_KEY]: string
  [C_RESEND_FROM]: string
  [C_RESEND_VERIFY_MAIL_SUBJECT]: string
  [C_JWT_EXPIRY]: string
  [C_JWT_SECRET]: string
  [C_JWT_REFRESH_EXPIRY]: string
  [C_JWT_REFRESH_SECRET]: string
  [C_OTP_EXPIRY]: string
  [C_API_PREFIX]: string
  [C_NODE_ENV]: string
  [C_BASE_URL]: string
}
