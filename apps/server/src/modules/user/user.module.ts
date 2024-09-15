import { Module } from '@nestjs/common'
import { AccountModule } from '../account/account.module'
import { VCodeModule } from '../vcode/vcode.module'
import { UserController } from './user.controller'
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
    UserService,
  ],
  exports: [
    UserService,
  ],
})
export class UserModule {}
