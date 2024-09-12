import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PermissionGuard } from './permission.guard'

describe('permissionGuard', () => {
  let permissionGuard: PermissionGuard
  let reflector: Reflector

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        {
          provide: Reflector,
          useValue: { get: vi.fn() },
        },
      ],
    }).compile()

    permissionGuard = moduleRef.get<PermissionGuard>(PermissionGuard)
    reflector = moduleRef.get<Reflector>(Reflector)
  })

  const mockExecutionContext = (user?: any): ExecutionContext => ({
    getHandler: vi.fn(),
    switchToHttp: vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue({ user }),
    }),
  } as unknown as ExecutionContext)

  it('should allow access when no permissions are required', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(undefined)
    const context = mockExecutionContext()

    const result = await permissionGuard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should throw UnauthorizedException when user is not present', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read'])
    const context = mockExecutionContext()

    await expect(permissionGuard.canActivate(context)).rejects.toThrow(UnauthorizedException)
  })

  it('should allow access when user has required permission', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read'])
    const context = mockExecutionContext({ permissionNames: ['read', 'write'] })

    const result = await permissionGuard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should throw ForbiddenException when user lacks required permission', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['admin'])
    const context = mockExecutionContext({ permissionNames: ['read', 'write'] })

    await expect(permissionGuard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })

  it('should allow access when user has at least one of the required permissions', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read', 'admin'])
    const context = mockExecutionContext({ permissionNames: ['read', 'write'] })

    const result = await permissionGuard.canActivate(context)

    expect(result).toBe(true)
  })
  it('should handle user with no permissions', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read'])
    const context = mockExecutionContext({ permissionNames: undefined })

    await expect(permissionGuard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })

  it('should handle empty required permissions array', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue([])
    const context = mockExecutionContext({ permissionNames: ['read'] })

    const result = await permissionGuard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should handle case-sensitive permission names', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['READ'])
    const context = mockExecutionContext({ permissionNames: ['read'] })

    await expect(permissionGuard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })

  it('should handle multiple required permissions', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['read', 'write', 'delete'])
    const context = mockExecutionContext({ permissionNames: ['read', 'write'] })

    const result = await permissionGuard.canActivate(context)

    expect(result).toBe(true)
  })
})
