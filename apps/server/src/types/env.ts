export const C_DATABASE_URL = 'DATABASE_URL'
export const C_DIRECT_URL = 'DIRECT_URL'
export const C_AUTH_SECRET = 'AUTH_SECRET'
export const C_RESEND_API_KEY = 'RESEND_API_KEY'
export const C_JWT_EXPIRY = 'JWT_EXPIRY'
export const C_JWT_SECRET = 'JWT_SECRET'
export const C_JWT_REFRESH_EXPIRY = 'JWT_REFRESH_EXPIRY'
export const C_JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET'

export interface Env {
  [C_DATABASE_URL]: string
  [C_DIRECT_URL]: string
  [C_AUTH_SECRET]: string
  [C_RESEND_API_KEY]: string
  [C_JWT_EXPIRY]: string
  [C_JWT_SECRET]: string
  [C_JWT_REFRESH_EXPIRY]: string
  [C_JWT_REFRESH_SECRET]: string
}
