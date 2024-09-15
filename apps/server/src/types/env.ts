import * as C from '@/modules/config/utils/consts'

export interface Env {
  [C.C_DATABASE_URL]: string
  [C.C_DIRECT_URL]: string
  [C.C_RESEND_API_KEY]: string
  [C.C_RESEND_FROM]: string
  [C.C_NB_MAIL_SUBJECT_VERIFY]: string
  [C.C_JWT_EXPIRY]: string
  [C.C_JWT_SECRET]: string
  [C.C_JWT_REFRESH_EXPIRY]: string
  [C.C_JWT_REFRESH_SECRET]: string
  [C.C_OTP_EXPIRY]: string
  [C.C_API_PREFIX]: string
  [C.C_NODE_ENV]: string
  [C.C_BASE_URL]: string
  [C.C_DEFAULT_ROLE_ID]: string
  [C.C_APP_PORT]: string
  [C.C_NB_SMTP_HOST]: string
  [C.C_NB_SMTP_PORT]: string
  [C.C_NB_SMTP_USER]: string
  [C.C_NB_SMTP_PASS]: string
}
