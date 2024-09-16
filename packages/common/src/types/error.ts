/**
 * Error enum, used to standardize error codes across the application.
 * Friendly to i18n in the client.
 */
export enum NBError {
  // Common
  UNKNOWN = 'error.unknown',
  UNAUTHORIZED = 'error.unauthorized',
  FORBIDDEN = 'error.forbidden',
  NOT_FOUND = 'error.notFound',
  DUPLICATE = 'error.duplicate',

  // Email
  EMAIL_NOT_VERIFIED = 'error.emailNotVerified',
  EMAIL_ALREADY_SENT = 'error.emailAlreadySent',
  EMAIL_SENT_FAILED = 'error.emailSentFailed',

  // Auth
  AUTH_OTP_EXISTS = 'error.authOTPExists',
}
