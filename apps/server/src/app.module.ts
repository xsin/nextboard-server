import process from 'node:process'
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { redisStore } from 'cache-manager-redis-yet'
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
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.NB_REDIS_HOST,
      port: process.env.NB_REDIS_PORT,
      ttl: 1000 * Number(process.env.NB_REDIS_TTL_COMMON),
      max: Number(process.env.NB_REDIS_MAX_ITEMS),
    }),
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
    // Global cache on every controller
    // https://docs.nestjs.com/techniques/caching
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    AppService,
    JwtService,

  ],
})
export class AppModule {}
