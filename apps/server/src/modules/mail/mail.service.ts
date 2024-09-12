import { randomCode } from '@/common/utils'
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { EmailType } from '@nextboard/common'
import { template } from 'radash'
import type { ISendEmailResult } from '@nextboard/common'
import { AppConfigService } from '../config/config.service'
import { VCodeService } from '../vcode/vcode.service'
import { ResendService } from './resend.service'

@Injectable()
export class MailService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly vcodeService: VCodeService,
    private readonly resendService: ResendService,
  ) {}

  async sendVerificationEmail(email: string, htmlContent?: string): Promise<ISendEmailResult> {
    const apiPrefix = this.configService.NB_API_PREFIX ? `${this.configService.NB_API_PREFIX}/` : ''
    const verificationLink = `${this.configService.NB_BASE_URL}/${apiPrefix}user/verify?email=${email}`

    htmlContent = htmlContent ?? `<h1>Please verify your email address by clicking on the link below:</h1>
                                  <a href="{{verificationLink}}">Verify Email</a>`

    const result = await this.resendService.sendEmail({
      from: this.configService.RESEND_FROM,
      to: email,
      subject: this.configService.RESEND_VERIFY_MAIL_SUBJECT ?? 'Welcome to NextBoard, Pls verify your email address',
      html: template(htmlContent, { verificationLink }),
    })

    if (result.error) {
      throw new InternalServerErrorException(result.error.message)
    }

    return {
      time: new Date(),
      type: EmailType.VERIFY,
    }
  }

  /**
   * Send OTP(One-time password) code to user's email
   * @param {string} email - User's email
   * @returns {Promise<ISendEmailResult>} OTP sending result
   */
  async sendOTP(email: string): Promise<ISendEmailResult> {
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

    const result = await this.resendService.sendEmail(mailOptions)
    if (result.error) {
      throw new InternalServerErrorException(result.error.message)
    }

    return {
      time: new Date(),
      duration: expiresInMs,
      type: EmailType.OTP,
    }
  }
}
