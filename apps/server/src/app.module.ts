import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthService } from './modules/auth/auth.service'
import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'
import { MailService } from './modules/mail/mail.service'
import { getConfig } from './common/configs'
import { MailModule } from './modules/mail/mail.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { MenuModule } from './modules/menu/menu.module'
import { RoleService } from './modules/role/role.service'
import { RoleModule } from './modules/role/role.module'
import { PermissionModule } from './modules/permission/permission.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      // Make the ConfigService available globally
      // Ref: https://docs.nestjs.com/techniques/configuration
      isGlobal: true,
    }),
    // Global modules decorated with @Global() are available globally
    AuthModule,
    PrismaModule,
    // Non-global modules are available only in the module where they are imported
    UserModule,
    MailModule,
    MenuModule,
    RoleModule,
    PermissionModule,
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
