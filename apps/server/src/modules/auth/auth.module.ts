import { Global, Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { MailService } from '../mail/mail.service'
import { JWTokenService } from '../token/jwtoken.service'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthGuard, PublicGuard } from './guards'

@Global()
@Module({
  providers: [
    AuthService,
    UserService,
    MailService,
    JwtService,
    JWTokenService,
    AuthGuard,
    PublicGuard,
  ],
  exports: [
    AuthService,
    AuthGuard,
    PublicGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
