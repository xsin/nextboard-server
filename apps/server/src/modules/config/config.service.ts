import path from 'node:path'
import fs from 'node:fs'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { IConfigDto } from './dto'

@Injectable()
export class AppConfigService {
  public config: IConfigDto

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<IConfigDto>('')
    this.mergePkgConfig(this.config)
  }

  mergePkgConfig(dto: IConfigDto): void {
    const pkgJsonPath = path.resolve(__dirname, '../../../package.json')
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    this.config = {
      ...dto,
      name: pkgJson.name,
      description: pkgJson.description,
      keywords: pkgJson.keywords,
      version: pkgJson.version,
      author: typeof (pkgJson.author) === 'string' ? pkgJson.author : pkgJson.author.name,
    }
  }
}
