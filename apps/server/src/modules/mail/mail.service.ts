import type { ISendEmailResult } from '@nextboard/common'
import { randomCode } from '@/common/utils'
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { EmailService, EmailType } from '@nextboard/common'
import { template } from 'radash'
import { AppConfigService } from '../config/config.service'
import { VCodeService } from '../vcode/vcode.service'
import { NodeMailerService } from './nodemailer.service'
import { ResendService } from './resend.service'

/**
 * Service for sending emails.
 */
@Injectable()
export class MailService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly vcodeService: VCodeService,
    private readonly resendService: ResendService,
    private readonly nodemailerService: NodeMailerService,
  ) {}

  /**
   * Sends a verification email to the specified email address.
   *
   * @param {string} email - The email address to send the verification email to.
   * @param {string} htmlContent - The HTML content of the email. If not provided, a default template will be used.
   * @param {EmailService} serviceType - The type of email service to use. Defaults to EmailService.NODEMAILER.
   * @returns {Promise<ISendEmailResult>} A Promise that resolves to an ISendEmailResult object.
   * @throws InternalServerErrorException if there is an error sending the email.
   */
  async sendVerificationEmail(
    email: string,
    htmlContent?: string,
    serviceType: EmailService = EmailService.NODEMAILER,
  ): Promise<ISendEmailResult> {
    const owner = this.vcodeService.generateOwner(email, EmailType.VERIFY)

    // Check if the user has a valid code
    const hasValidCode = await this.vcodeService.hasValidCode({ owner })
    if (hasValidCode) {
      throw new BadRequestException('A valid verification email already sent!')
    }

    // Create token record in the database
    const code = randomCode(6) // Generate a simple code
    const expiresInMs = this.configService.NB_MAIL_VERIFY_EXPIRY * 1000
    const expiredAt = new Date(Date.now() + expiresInMs)

    await this.vcodeService.create({
      owner,
      code,
      expiredAt,
    })

    const apiPrefix = this.configService.NB_API_PREFIX ? `${this.configService.NB_API_PREFIX}/` : ''
    const verificationLink = `${this.configService.NB_BASE_URL}/${apiPrefix}user/verify?email=${email}&vcode=${code}`
    const subject = this.configService.NB_MAIL_SUBJECT_VERIFY || 'Welcome to NextBoard, Pls verify your email address'

    htmlContent = htmlContent ?? `<h1>Please verify your email address by clicking on the link below:</h1>
                                  <a href="{{verificationLink}}">Verify Email</a>`

    const mailOptions = {
      from: this.configService.RESEND_FROM,
      to: email,
      subject,
      html: template(htmlContent, { verificationLink }),
    }

    const result = serviceType === EmailService.NODEMAILER
      ? await this.nodemailerService.sendEmail(mailOptions)
      : await this.resendService.sendEmail(mailOptions)

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
   * @param {EmailService} serviceType - Email service type (default: EmailService.NODEMAILER)
   * @returns {Promise<ISendEmailResult>} OTP sending result
   */
  async sendOTP(
    email: string,
    serviceType: EmailService = EmailService.NODEMAILER,
  ): Promise<ISendEmailResult> {
    // Check if the user has a valid code
    const hasValidCode = await this.vcodeService.hasValidCode({ owner: email })
    if (hasValidCode) {
      throw new BadRequestException('A valid OTP already exists')
    }

    // Create token record in the database
    const code = randomCode(6) // Generate a simple code
    const expiresInMs = this.configService.NB_OTP_EXPIRY * 1000
    const expiredAt = new Date(Date.now() + expiresInMs)

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

    const result = serviceType === EmailService.NODEMAILER
      ? await this.nodemailerService.sendEmail(mailOptions)
      : await this.resendService.sendEmail(mailOptions)

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
