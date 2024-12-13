import { Logger } from '@nestjs/common';
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
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger('ChatGateway');
  private chatRooms: Record<string, Set<string>> = {};

  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const token = client.handshake.query.token as string;
    if (!token) {
      this.logger.error('No token provided');
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify(token);
      this.logger.log(`Authenticated user: ${payload.email}`);
    } catch (error) {
      this.logger.error('Invalid token', error.message);
      client.disconnect();
    }
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
    @MessageBody() { roomId, nickname }: { roomId: string; nickname: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`User ${nickname} joining room: ${roomId}`);
    if (!this.chatRooms[roomId]) {
      this.chatRooms[roomId] = new Set();
    }
    client.join(roomId);
    this.chatRooms[roomId].add(client.id);
    this.server.to(roomId).emit('userJoined', { userId: client.id, nickname });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() { roomId, message, sender }: { roomId: string; message: string; sender: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Message received from ${sender} in room ${roomId}: ${message}`);
    this.server.to(roomId).emit('receiveMessage', { sender, message });
  }
}
