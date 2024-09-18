import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { TokenService } from '../auth/token.service'
import { UserService } from './user.service'

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = client.handshake.query.token as string
    const user = await this.tokenService.parseUserFrowJwt(token)
    if (!user) {
      client.disconnect()
      return
    }
    await this.userService.update(user.id, {
      online: true,
      loginAt: new Date(),
    })
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const token = client.handshake.query.token as string
    const user = await this.tokenService.parseUserFrowJwt(token)
    if (!user) {
      return
    }
    await this.userService.update(user.id, { online: false })
  }
}
