import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { AppService } from './app.service'
import { ApiResponseX } from './common/dto'

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({
    type: ApiResponseX<string>,
  })
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
