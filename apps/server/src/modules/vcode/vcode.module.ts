import { Global, Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { VCodeService } from './vcode.service'

@Global()
@Module({
  providers: [
    VCodeService,
  ],
  exports: [
    VCodeService,
  ],
  imports: [
    PrismaModule,
  ],
})
export class VCodeModule {}
