import { beforeEach, describe, expect, it } from 'vitest'
import { AppService } from './app.service'
import { AppConfigService } from './modules/config/config.service'
import { AppDto } from './app.dto'

describe('appService', () => {
  let appService: AppService
  let configService: AppConfigService

  beforeEach(() => {
    configService = {
      name: 'Test App',
      description: 'This is a test app',
      keywords: ['test', 'app'],
      version: '1.0.0',
      author: { name: 'Test Author' },
    } as AppConfigService

    appService = new AppService(configService)
  })

  it('should return app info', () => {
    const expectedInfo: AppDto = {
      name: 'Test App',
      description: 'This is a test app',
      keywords: ['test', 'app'],
      version: '1.0.0',
      author: 'Test Author',
    }

    const info = appService.info()
    expect(info).toEqual(expectedInfo)
  })
})
