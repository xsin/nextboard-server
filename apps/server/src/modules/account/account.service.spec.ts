import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { AccountService } from './account.service'

describe('accountService', () => {
  let service: AccountService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountService],
    }).compile()

    service = module.get<AccountService>(AccountService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
