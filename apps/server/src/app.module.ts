import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './common/prisma.service'
import { AuthService } from './modules/auth/auth.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { MailService } from './modules/mail/mail.service'
import { getConfig } from './common/configs'
import { MailModule } from './modules/mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
    }),
    AuthModule,
    UserModule,
    MailModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    PrismaService,
    AppService,
    AuthService,
    MailService,
  ],
})
export class AppModule {}
