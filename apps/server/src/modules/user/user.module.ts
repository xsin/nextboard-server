import { Module } from '@nestjs/common'
import { MailModule } from '../mail/mail.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    MailModule,
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
