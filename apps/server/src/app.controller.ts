import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { AppDto } from './app.dto'
import { AppService } from './app.service'
import { NBApiResponse } from './common/decorators/api.decorator'
import { Public } from './modules/auth/decorators/public.decorator'

@Public()
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @NBApiResponse(AppDto, {
    description: 'Get app information',
  })
  @ApiOperation({
    summary: 'Get app information',
  })
  @Get()
  getInfo(): AppDto {
    return this.appService.info()
  }
}
