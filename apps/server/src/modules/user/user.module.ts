import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma.service'
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
    PrismaService,
    UserService,
  ],
})
export class UserModule {}
