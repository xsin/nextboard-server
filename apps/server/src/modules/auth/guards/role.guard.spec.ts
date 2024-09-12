import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RoleGuard } from './role.guard'

describe('roleGuard', () => {
  let roleGuard: RoleGuard
  let reflector: Reflector

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: { get: vi.fn() },
        },
      ],
    }).compile()

    roleGuard = moduleRef.get<RoleGuard>(RoleGuard)
    reflector = moduleRef.get<Reflector>(Reflector)
  })

  const mockExecutionContext = (user?: any): ExecutionContext => ({
    getHandler: vi.fn(),
    switchToHttp: vi.fn().mockReturnValue({
      getRequest: vi.fn().mockReturnValue({ user }),
    }),
  } as unknown as ExecutionContext)

  it('should allow access when no roles are required', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(undefined)
    const context = mockExecutionContext()

    const result = await roleGuard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should throw UnauthorizedException when user is not present', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['admin'])
    const context = mockExecutionContext()

    await expect(roleGuard.canActivate(context)).rejects.toThrow(UnauthorizedException)
  })

  it('should allow access when user has required role', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['admin'])
    const context = mockExecutionContext({ roleNames: ['admin', 'user'] })

    const result = await roleGuard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should throw ForbiddenException when user lacks required role', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['superadmin'])
    const context = mockExecutionContext({ roleNames: ['admin', 'user'] })

    await expect(roleGuard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })

  it('should allow access when user has at least one of the required roles', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['admin', 'superadmin'])
    const context = mockExecutionContext({ roleNames: ['admin', 'user'] })

    const result = await roleGuard.canActivate(context)

    expect(result).toBe(true)
  })

  it('should handle user with no roles', async () => {
    vi.spyOn(reflector, 'get').mockReturnValue(['admin'])
    const context = mockExecutionContext({ roleNames: undefined })

    await expect(roleGuard.canActivate(context)).rejects.toThrow(ForbiddenException)
  })
})
