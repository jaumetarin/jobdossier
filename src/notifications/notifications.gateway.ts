import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';


@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server!: Server;

 async handleConnection(client: Socket) {
  const token = client.handshake.auth?.token;

  if (!token) {
    client.disconnect();
    return;
  }

  try {
    const payload = await this.jwtService.verifyAsync(token);

    const userId = payload.sub;
    const roomName = `user:${userId}`;

    client.join(roomName);
    console.log(`User ${userId} connected with socket ${client.id}`);

  } catch {
    client.disconnect();
  }
}
  emitNewOfferToUser(userId: number, offer: unknown) {
    const roomName = `user:${userId}`;
    this.server.to(roomName).emit('new-offer', offer);
  }


  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}
