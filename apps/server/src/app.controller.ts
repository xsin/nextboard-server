import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { AppService } from './app.service'
import { AppDto, AppResponse } from './app.dto'
import { PublicGuard } from './modules/auth/guards'

@UseGuards(PublicGuard)
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    type: AppResponse,
  })
  @Get()
  getInfo(): AppDto {
    return this.appService.info()
  }
}
