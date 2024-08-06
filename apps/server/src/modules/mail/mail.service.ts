import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { C_RESEND_API_KEY } from 'src/types'
import type { IConfigs, IPublicConfig } from 'src/types'
import { template } from 'radash'

@Injectable()
export class MailService {
  private readonly mailer: Resend
  private readonly pubConfigs: IPublicConfig

  constructor(private readonly configService: ConfigService<IConfigs>) {
    this.pubConfigs = this.configService.get('public')
    this.mailer = new Resend(this.configService.get(C_RESEND_API_KEY))
  }

  async sendVerificationEmail(email: string, htmlContent?: string): Promise<void> {
    const apiPrefix = this.pubConfigs.apiPrefix ? `${this.pubConfigs.apiPrefix}/` : ''
    const verificationLink = `${this.pubConfigs.baseUrl}/${apiPrefix}user/verify?email=${email}`

    htmlContent = htmlContent ?? `<h1>Please verify your email address by clicking on the link below:</h1>
                                  <a href="{{verificationLink}}">Verify Email</a>`

    await this.mailer.emails.send({
      from: this.pubConfigs.resendFrom ?? 'no-reply@xsin.work',
      to: email,
      subject: this.pubConfigs.resendVerifyMailSubject ?? 'Welcome to NextBoard, Pls verify your email address',
      html: template(htmlContent, { verificationLink }),
    })
  }
}
