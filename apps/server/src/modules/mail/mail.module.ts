import { Module } from '@nestjs/common'
import { VCodeModule } from '../vcode/vcode.module'
import { MailService } from './mail.service'

@Module({
  imports: [
    VCodeModule,
  ],
  providers: [
    MailService,
  ],
  exports: [
    MailService,
  ],
})
export class MailModule {}
