import { Module } from '@nestjs/common'
import { VCodeModule } from '../vcode/vcode.module'
import { MailService } from './mail.service'
import { ResendService } from './resend.service'

@Module({
  imports: [
    VCodeModule,
  ],
  providers: [
    ResendService,
    MailService,
  ],
  exports: [
    ResendService,
    MailService,
  ],
})
export class MailModule {}
