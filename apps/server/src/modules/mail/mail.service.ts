import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import { template } from 'radash'
import type { ISendOTPResult } from '@nextboard/common'
import { AppConfigService } from '../config/config.service'
import { VCodeService } from '../vcode/vcode.service'
import { randomCode } from '@/common/utils'

@Injectable()
export class MailService {
  private readonly mailer: Resend

  constructor(
    private readonly configService: AppConfigService,
    private readonly vcodeService: VCodeService,
  ) {
    this.mailer = new Resend(this.configService.RESEND_API_KEY)
  }

  async sendVerificationEmail(email: string, htmlContent?: string): Promise<void> {
    const apiPrefix = this.configService.NB_API_PREFIX ? `${this.configService.NB_API_PREFIX}/` : ''
    const verificationLink = `${this.configService.NB_BASE_URL}/${apiPrefix}user/verify?email=${email}`

    htmlContent = htmlContent ?? `<h1>Please verify your email address by clicking on the link below:</h1>
                                  <a href="{{verificationLink}}">Verify Email</a>`

    await this.mailer.emails.send({
      from: this.configService.RESEND_FROM,
      to: email,
      subject: this.configService.RESEND_VERIFY_MAIL_SUBJECT ?? 'Welcome to NextBoard, Pls verify your email address',
      html: template(htmlContent, { verificationLink }),
    })
  }

  /**
   * Send OTP(One-time password) code to user's email
   * @param {string} email - User's email
   * @returns {Promise<ISendOTPResult>} OTP sending result
   */
  async sendOTP(email: string): Promise<ISendOTPResult> {
    const code = randomCode(6) // Generate a simple code
    const expiresInMs = this.configService.NB_OTP_EXPIRY * 1000
    const expiredAt = new Date(Date.now() + expiresInMs)

    // Create token record in the database
    await this.vcodeService.create({
      owner: email,
      code,
      expiredAt,
    })

    const mailOptions = {
      from: this.configService.RESEND_FROM,
      to: email,
      subject: 'NextBoard login code',
      html: `Your login verification code is ${code}`,
    }

    await this.mailer.emails.send(mailOptions)

    return {
      time: new Date(),
      duration: expiresInMs,
    }
  }
}
