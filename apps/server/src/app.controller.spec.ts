import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppDto } from './app.dto'
import { AppConfigModule } from './modules/config/config.module'

describe('appController', () => {
  let appController: AppController
  let appService: AppService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
      ],
      imports: [
        AppConfigModule,
      ],
    })
      .compile()

    appService = module.get<AppService>(AppService)
    appController = module.get<AppController>(AppController)
  })

  describe('getInfo', () => {
    it('should return AppDto', () => {
      const result: AppDto = {
        name: 'NextBoard',
        version: '1.0.0',
        description: 'The Next-Gen Dashboard for modern web applications',
        keywords: ['NextBoard'],
        author: 'XSIN Studio',
      }
      vi.spyOn(appService, 'info').mockImplementation(() => result)

      expect(appController.getInfo()).toBe(result)
    })
  })
})
