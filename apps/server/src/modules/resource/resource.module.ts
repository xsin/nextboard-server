import { Module } from '@nestjs/common'
import { ResourceService } from './resource.service'
import { ResourceController } from './resource.controller'

@Module({
  controllers: [ResourceController],
  providers: [ResourceService],
  exports: [ResourceService],
})
export class ResourceModule {}
