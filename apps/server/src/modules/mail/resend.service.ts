import { Injectable } from '@nestjs/common'
import { type CreateEmailOptions, type CreateEmailResponse, Resend } from 'resend'
import { AppConfigService } from '../config/config.service'

@Injectable()
export class ResendService {
  private resend: Resend

  constructor(private readonly configService: AppConfigService) {
    this.resend = new Resend(this.configService.RESEND_API_KEY)
  }

  async sendEmail(options: CreateEmailOptions): Promise<CreateEmailResponse> {
    return this.resend.emails.send(options)
  }
}
