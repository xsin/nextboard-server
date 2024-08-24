import { Global, Module } from '@nestjs/common'
import { JWTokenService } from '../token/jwtoken.service'
import { PrismaModule } from '../prisma/prisma.module'
import { TokenService } from './token.service'

@Global()
@Module({
  providers: [
    JWTokenService,
  ],
  exports: [
    JWTokenService,
    TokenService,
  ],
  imports: [
    PrismaModule,
  ],
})
export class TokenModule {}
