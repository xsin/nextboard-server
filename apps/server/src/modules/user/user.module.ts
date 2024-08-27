import { Module } from '@nestjs/common'
import { AccountModule } from '../account/account.module'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    AccountModule,
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
