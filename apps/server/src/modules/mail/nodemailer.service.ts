import type { ICreateEmailResponse, INodeMailerResponse, TCreateEmailOptions } from '@/types'

import type { SendMailOptions, Transporter } from 'nodemailer'
import { Injectable } from '@nestjs/common'
import { createTransport } from 'nodemailer'
import { AppConfigService } from '../config/config.service'

@Injectable()
export class NodeMailerService {
  private sender: Transporter

  constructor(private readonly configService: AppConfigService) {
    this.sender = createTransport({
      host: this.configService.NB_SMTP_HOST,
      port: this.configService.NB_SMTP_PORT,
      secure: this.configService.NB_SMTP_SECURE,
      auth: {
        user: this.configService.NB_SMTP_USER,
        pass: this.configService.NB_SMTP_PASS,
      },
    })
  }

  async sendEmail(options: TCreateEmailOptions): Promise<ICreateEmailResponse> {
    const opts: SendMailOptions = {
      from: options.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    }
    try {
      const info: INodeMailerResponse = await this.sender.sendMail(opts)
      return {
        data: {
          id: info.messageId,
        },
        error: null,
      }
    }
    catch (e) {
      return {
        data: null,
        error: e,
      }
    }
  }
}
