import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { RoleController } from './role.controller'
import { RoleService } from './role.service'

describe('roleController', () => {
  let controller: RoleController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoleController],
      providers: [RoleService],
    }).compile()

    controller = module.get<RoleController>(RoleController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
