import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthService } from './modules/auth/auth.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { MailService } from './modules/mail/mail.service'
import { MailModule } from './modules/mail/mail.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { ResourceModule } from './modules/resource/resource.module'
import { RoleService } from './modules/role/role.service'
import { RoleModule } from './modules/role/role.module'
import { PermissionModule } from './modules/permission/permission.module'
import { VCodeModule } from './modules/vcode/vcode.module'
import { AppConfigModule } from './modules/config/config.module'
import { AccountModule } from './modules/account/account.module'
import { LogModule } from './modules/log/log.module'

@Module({
  imports: [
    // Global modules decorated with @Global() are available globally
    // Non-global modules are available only in the module where they are imported
    AppConfigModule,
    AuthModule,
    PrismaModule,
    UserModule,
    MailModule,
    ResourceModule,
    RoleModule,
    PermissionModule,
    VCodeModule,
    AccountModule,
    LogModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    AuthService,
    MailService,
    RoleService,
    JwtService,
  ],
})
export class AppModule {}
