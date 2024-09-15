import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AccountModule } from './modules/account/account.module'
import { AuthModule } from './modules/auth/auth.module'
import { AppConfigModule } from './modules/config/config.module'
import { DictModule } from './modules/dict/dict.module'
import { LogModule } from './modules/log/log.module'
import { MailModule } from './modules/mail/mail.module'
import { PermissionModule } from './modules/permission/permission.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { ResourceModule } from './modules/resource/resource.module'
import { RoleModule } from './modules/role/role.module'
import { UserModule } from './modules/user/user.module'
import { VCodeModule } from './modules/vcode/vcode.module'

@Module({
  imports: [
    // Global modules decorated with @Global() are available globally
    AppConfigModule,
    PrismaModule,
    AuthModule,
    // Non-global modules are available only in the module where they are imported
    UserModule,
    MailModule,
    ResourceModule,
    RoleModule,
    PermissionModule,
    VCodeModule,
    AccountModule,
    LogModule,
    DictModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    JwtService,
  ],
})
export class AppModule {}
