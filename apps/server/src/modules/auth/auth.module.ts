import { Module } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma.service'
import { UserService } from '../user/user.service'
import { MailService } from '../mail/mail.service'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  providers: [
    AuthService,
    PrismaService,
    UserService,
    MailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
