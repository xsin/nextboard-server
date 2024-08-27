import { Global, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserModule } from '../user/user.module'
import { MailModule } from '../mail/mail.module'
import { VCodeModule } from '../vcode/vcode.module'
import { TokenService } from './token.service'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthGuard, PublicGuard } from './guards'
import { RoleGuard } from './guards/role.guard'
import { PermissionGuard } from './guards/permission.guard'

// Use @Global() to make the module available globally
// So that we can use `PublicGuard` without importing the `AuthModule` in other modules
@Global()
@Module({
  imports: [
    UserModule,
    MailModule,
    VCodeModule,
    // Use JwtService instead of JwtModule in the providers configuration
    // So that we can configure differences secrets for accessToken and refreshToken
    /*
    JwtModule.registerAsync({
      imports: [AppConfigService],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.config.JWT_TOKEN_SECRET,
        signOptions: { expiresIn: configService.config.JWT_TOKEN_EXPIRY },
      }),
      inject: [AppConfigService],
    }),
    */
  ],
  providers: [
    AuthService,
    TokenService,
    JwtService,
    PublicGuard,
    AuthGuard,
    RoleGuard,
    PermissionGuard,
  ],
  exports: [
    AuthService,
    TokenService,
    PublicGuard,
    AuthGuard,
    RoleGuard,
    PermissionGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
