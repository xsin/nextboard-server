export interface ISendOTPResult {
  /**
   * Server time when the OTP is sent
   */
  time: Date
  /**
   * Validity duration of the OTP in milliseconds
   */
  duration: number
}
