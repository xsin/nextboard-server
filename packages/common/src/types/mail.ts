export enum EmailType {
  VERIFY = 'verify',
  OTP = 'otp',
}

export enum EmailService {
  NODEMAILER = 'NODEMAILER',
  RESEND = 'RESEND',
}

export interface ISendEmailResult {
  /**
   * Email type
   */
  type: EmailType
  /**
   * Server time when the mail is sent
   */
  time: Date
  /**
   * Re-send duration in milliseconds
   */
  duration?: number
}
