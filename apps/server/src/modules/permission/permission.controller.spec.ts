import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { PermissionController } from './permission.controller'
import { PermissionService } from './permission.service'

describe('permissionController', () => {
  let controller: PermissionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionController],
      providers: [PermissionService],
    }).compile()

    controller = module.get<PermissionController>(PermissionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
