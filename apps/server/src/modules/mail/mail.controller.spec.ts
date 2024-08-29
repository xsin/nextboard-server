import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { MailController } from './mail.controller'

describe('mailController', () => {
  let controller: MailController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
    }).compile()

    controller = module.get<MailController>(MailController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
