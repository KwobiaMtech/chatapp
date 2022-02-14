import { ConnectedUserService } from './../services/connected-user.service';
import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserService } from 'src/modules/auth/services/user.service';
import { Socket, Server } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4000', 'http://localhost:3000'],
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private connectedUserService: ConnectedUserService,
  ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      console.log('token', socket.handshake.headers.authorization);

      const tokenInfo: any = await lastValueFrom(
        await this.authService.decodeToken(
          socket.handshake.headers.authorization,
        ),
      );

      const user = await this.userService.getTokenUser(tokenInfo.email);
      if (!user) {
        return this.disconnect(socket);
      } else {
        socket.data.user = user;
        const ifConnected = await this.connectedUserService.findUser(user);
        console.log('if connected', ifConnected);
        if (!ifConnected) {
          await this.connectedUserService.create({ socketId: socket.id, user });
        }
        const connectedUsers = await this.connectedUserService.all();
        console.log('get all connected users', connectedUsers);
        return this.server.to(socket.id).emit('online-users', connectedUsers);
      }
    } catch {
      return this.disconnect(socket);
    }
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }



  @SubscribeMessage('sendMessage')
  async onSentMessage(socket: Socket, data) {
    console.log('received user', data);
    const user = data.receiver;
    console.log('send to receiver', user);
    await this.server.to(user.socketId).emit('receivedMessage', data.message);
  }
}
