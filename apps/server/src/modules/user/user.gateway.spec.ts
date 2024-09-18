import { Test, TestingModule } from '@nestjs/testing'
import { Socket } from 'socket.io'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TokenService } from '../auth/token.service'
import { UserGateway } from './user.gateway'
import { UserService } from './user.service'

describe('userGateway', () => {
  let gateway: UserGateway
  let userService: UserService
  let tokenService: TokenService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserGateway,
        {
          provide: UserService,
          useValue: {
            update: vi.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            parseUserFrowJwt: vi.fn().mockResolvedValue({ id: 'user-id' }),
          },
        },
      ],
    }).compile()

    gateway = module.get<UserGateway>(UserGateway)
    userService = module.get<UserService>(UserService)
    tokenService = module.get<TokenService>(TokenService)
  })

  it('should update user status to online on connection', async () => {
    const client = { handshake: { query: { token: 'valid-token' } } } as unknown as Socket
    await gateway.handleConnection(client)
    expect(tokenService.parseUserFrowJwt).toHaveBeenCalledWith('valid-token')
    expect(userService.update).toHaveBeenCalledWith('user-id', {
      online: true,
      loginAt: expect.any(Date),
    })
  })

  it('should disconnect client if user is not found on connection', async () => {
    vi.spyOn(tokenService, 'parseUserFrowJwt').mockResolvedValueOnce(null)
    const client = { handshake: { query: { token: 'invalid-token' } }, disconnect: vi.fn() } as unknown as Socket
    await gateway.handleConnection(client)
    expect(client.disconnect).toHaveBeenCalled()
  })

  it('should update user status to offline on disconnection', async () => {
    const client = { handshake: { query: { token: 'valid-token' } } } as unknown as Socket
    await gateway.handleDisconnect(client)
    expect(tokenService.parseUserFrowJwt).toHaveBeenCalledWith('valid-token')
    expect(userService.update).toHaveBeenCalledWith('user-id', { online: false })
  })

  it('should not update user status if user is not found on disconnection', async () => {
    vi.spyOn(tokenService, 'parseUserFrowJwt').mockResolvedValueOnce(null)
    const client = { handshake: { query: { token: 'invalid-token' } } } as unknown as Socket
    await gateway.handleDisconnect(client)
    expect(userService.update).not.toHaveBeenCalled()
  })
})
