import { Injectable } from '@nestjs/common'
import { AppDto } from './app.dto'
import { getConfig } from './common/configs'

@Injectable()
export class AppService {
  info(): AppDto {
    const cfg = getConfig().public
    return {
      name: cfg.name,
      description: cfg.description,
      keywords: cfg.keywords,
      version: cfg.version,
      author: cfg.author,
    }
  }
}
