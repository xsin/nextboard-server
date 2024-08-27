import { Injectable } from '@nestjs/common'
import { AppDto } from './app.dto'
import { AppConfigService } from './modules/config/config.service'

@Injectable()
export class AppService {
  constructor(
    private readonly configService: AppConfigService,
  ) {}

  info(): AppDto {
    const cfg = this.configService.config
    return {
      name: cfg.name,
      description: cfg.description,
      keywords: cfg.keywords,
      version: cfg.version,
      author: cfg.author,
    }
  }
}
