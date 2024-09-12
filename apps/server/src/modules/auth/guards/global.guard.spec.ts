import { ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthGuard } from './auth.guard'
import { GlobalGuard } from './global.guard'
import { PermissionGuard } from './permission.guard'
import { RoleGuard } from './role.guard'

describe('globalGuard', () => {
  let globalGuard: GlobalGuard
  let reflector: Reflector
  let authGuard: AuthGuard
  let roleGuard: RoleGuard
  let permissionGuard: PermissionGuard

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GlobalGuard,
        {
          provide: Reflector,
          useValue: { getAllAndOverride: vi.fn() },
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: vi.fn() },
        },
        {
          provide: RoleGuard,
          useValue: { canActivate: vi.fn() },
        },
        {
          provide: PermissionGuard,
          useValue: { canActivate: vi.fn() },
        },
      ],
    }).compile()

    globalGuard = moduleRef.get<GlobalGuard>(GlobalGuard)
    reflector = moduleRef.get<Reflector>(Reflector)
    authGuard = moduleRef.get<AuthGuard>(AuthGuard)
    roleGuard = moduleRef.get<RoleGuard>(RoleGuard)
    permissionGuard = moduleRef.get<PermissionGuard>(PermissionGuard)
  })

  const mockExecutionContext = (): ExecutionContext => ({
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: vi.fn().mockReturnValue({
      getRequest: vi.fn(),
      getResponse: vi.fn(),
    }),
    getType: vi.fn(),
    switchToRpc: vi.fn(),
    switchToWs: vi.fn(),
    getArgs: vi.fn(),
    getArgByIndex: vi.fn(),
  })

  it('should allow access for public routes', async () => {
    const mockContext = mockExecutionContext()
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)

    const result = await globalGuard.canActivate(mockContext)

    expect(result).toBe(true)
  })

  it('should check all guards for non-public routes', async () => {
    const mockContext = mockExecutionContext()
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    vi.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
    vi.spyOn(roleGuard, 'canActivate').mockResolvedValue(true)
    vi.spyOn(permissionGuard, 'canActivate').mockResolvedValue(true)

    const result = await globalGuard.canActivate(mockContext)

    expect(result).toBe(true)
    expect(authGuard.canActivate).toHaveBeenCalled()
    expect(roleGuard.canActivate).toHaveBeenCalled()
    expect(permissionGuard.canActivate).toHaveBeenCalled()
  })

  it('should deny access if AuthGuard fails', async () => {
    const mockContext = mockExecutionContext()
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    vi.spyOn(authGuard, 'canActivate').mockResolvedValue(false)

    const result = await globalGuard.canActivate(mockContext)

    expect(result).toBe(false)
    expect(roleGuard.canActivate).not.toHaveBeenCalled()
    expect(permissionGuard.canActivate).not.toHaveBeenCalled()
  })

  it('should deny access if RoleGuard fails', async () => {
    const mockContext = mockExecutionContext()
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    vi.spyOn(authGuard, 'canActivate').mockResolvedValue(true)
    vi.spyOn(roleGuard, 'canActivate').mockResolvedValue(false)

    const result = await globalGuard.canActivate(mockContext)

    expect(result).toBe(false)
    expect(permissionGuard.canActivate).not.toHaveBeenCalled()
  })
})
