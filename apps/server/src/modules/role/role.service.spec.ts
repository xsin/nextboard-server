import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from './role.service'

describe('roleService', () => {
  let service: RoleService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleService],
    }).compile()

    service = module.get<RoleService>(RoleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
