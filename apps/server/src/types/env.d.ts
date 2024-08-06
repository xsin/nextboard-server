export const C_DATABASE_URL = 'DATABASE_URL'
export const C_DIRECT_URL = 'DIRECT_URL'
export const C_AUTH_SECRET = 'AUTH_SECRET'
export const C_RESEND_API_KEY = 'RESEND_API_KEY'

export interface Env {
  [C_DATABASE_URL]: string
  [C_DIRECT_URL]: string
  [C_AUTH_SECRET]: string
  [C_RESEND_API_KEY]: string
}
