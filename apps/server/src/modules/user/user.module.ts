import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AccountModule } from '../account/account.module'
import { TokenService } from '../auth/token.service'
import { VCodeModule } from '../vcode/vcode.module'
import { UserController } from './user.controller'
import { UserGateway } from './user.gateway'
import { UserService } from './user.service'

@Module({
  imports: [
    AccountModule,
    VCodeModule,
  ],
  controllers: [
    UserController,
  ],
  providers: [
    TokenService,
    JwtService,
    UserGateway,
    UserService,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}
