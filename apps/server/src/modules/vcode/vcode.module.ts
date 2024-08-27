import { Module } from '@nestjs/common'
import { VCodeService } from './vcode.service'

@Module({
  providers: [
    VCodeService,
  ],
  exports: [
    VCodeService,
  ],
})
export class VCodeModule {}
