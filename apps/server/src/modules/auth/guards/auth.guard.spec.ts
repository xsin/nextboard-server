import type { IUser } from '@xsin/xboard'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthService } from '../auth.service'
import { AuthGuard } from './auth.guard'

describe('authGuard', () => {
  let authGuard: AuthGuard
  let authService: AuthService

  const mockUser: IUser = {
    id: '1',
    name: 'John Doe',
    displayName: 'John Doe',
    email: 'john.doe@example.com',
    emailVerifiedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    avatar: 'https://example.com/avatar.png',
    gender: 'male',
    birthday: new Date(),
    online: true,
    disabled: false,
    createdBy: '1',
    updatedBy: '1',
    loginAt: new Date(),
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: AuthService,
          useValue: {
            getCurrentUser: vi.fn(),
          },
        },
      ],
    }).compile()

    authGuard = moduleRef.get<AuthGuard>(AuthGuard)
    authService = moduleRef.get<AuthService>(AuthService)
  })

  it('should allow access when user is authenticated', async () => {
    const mockContext = createMockExecutionContext()
    vi.spyOn(authService, 'getCurrentUser').mockResolvedValue(mockUser)

    const result = await authGuard.canActivate(mockContext)

    expect(result).toBe(true)
  })

  it('should throw UnauthorizedException when user is not authenticated', async () => {
    const mockContext = createMockExecutionContext()
    vi.spyOn(authService, 'getCurrentUser').mockResolvedValue(null)

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException)
  })
})

function createMockExecutionContext(): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({}),
      getResponse: () => ({}),
    }),
  } as ExecutionContext
}
