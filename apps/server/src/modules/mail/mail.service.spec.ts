import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { MailService } from './mail.service'

describe('mailService', () => {
  let service: MailService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile()

    service = module.get<MailService>(MailService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
