export enum EmailType {
  VERIFY = 'verify',
  OTP = 'otp',
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
