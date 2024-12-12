import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001, { cors: { origin: '*' } }) // WebSocket은 3001 포트
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChatGateway');
  private chatRooms: Record<string, Set<string>> = {};

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    Object.keys(this.chatRooms).forEach((roomId) => {
      if (this.chatRooms[roomId]?.has(client.id)) {
        this.chatRooms[roomId].delete(client.id);
        this.server.to(roomId).emit('userLeft', { userId: client.id });
      }
    });
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @MessageBody() { roomId, username }: { roomId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!this.chatRooms[roomId]) {
      this.chatRooms[roomId] = new Set();
    }
    client.join(roomId);
    this.chatRooms[roomId].add(client.id);
    this.server.to(roomId).emit('userJoined', { userId: client.id, username });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() { roomId, message, sender }: { roomId: string; message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.server.to(roomId).emit('receiveMessage', { sender, message });
  }
}
