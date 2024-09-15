import { Module } from '@nestjs/common'
import { VCodeModule } from '../vcode/vcode.module'
import { MailService } from './mail.service'
import { NodeMailerService } from './nodemailer.service'
import { ResendService } from './resend.service'
import { TemplateService } from './template.service'

@Module({
  imports: [
    VCodeModule,
  ],
  providers: [
    ResendService,
    NodeMailerService,
    TemplateService,
    MailService,
  ],
  exports: [
    ResendService,
    NodeMailerService,
    TemplateService,
    MailService,
  ],
})
export class MailModule {}
