import { Module } from '@nestjs/common'
import { VCodeModule } from '../vcode/vcode.module'
import { MailService } from './mail.service'
import { NodeMailerService } from './nodemailer.service'
import { ResendService } from './resend.service'

@Module({
  imports: [
    VCodeModule,
  ],
  providers: [
    ResendService,
    NodeMailerService,
    MailService,
  ],
  exports: [
    ResendService,
    NodeMailerService,
    MailService,
  ],
})
export class MailModule {}
