import { Module } from '@nestjs/common'
import { MailModule } from '../mail/mail.module'
import { AccountModule } from '../account/account.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    MailModule,
    AccountModule,
  ],
  controllers: [
    UserController,
  ],
  providers: [
    UserService,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}
