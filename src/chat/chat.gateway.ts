import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken'; // JWT 검증을 위한 라이브러리
import { ConfigService } from '@nestjs/config';

@WebSocketGateway(3001, { cors: { origin: '*' } }) // WebSocket은 3001 포트
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly configService: ConfigService) {}
  private readonly logger = new Logger('ChatGateway');
  private chatRooms: Record<string, Set<string>> = {};

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    try {
      // WebSocket 연결 시 JWT 검증
      const token = client.handshake.auth.token;
      console.log('token : ', token);
      if (token) {
        // 토큰이 있으면 검증
        const secretKey = this.configService.get('JWT_SECRET_KEY');
        const decoded = jwt.verify(token, secretKey); // JWT 검증
        console.log('decoded 출력 : ', decoded);
        client.data.user = decoded; // 사용자 정보 저장
        this.logger.log(`Client connected: ${client.id}, user: ${client.data.user.nickname}`);
      } else {
        // 토큰이 없으면 비로그인 사용자로 처리
        client.data.user = { username: `Guest${Math.floor(Math.random() * 1000)}` };
        this.logger.log(`Client connected as Guest: ${client.id}`);
      }
    } catch (err) {
      this.logger.error(`JWT verification failed: ${err.message}`);
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
    if (!this.chatRooms[roomId]) {
      this.chatRooms[roomId] = new Set();
    }
    client.join(roomId);
    this.chatRooms[roomId].add(client.id);
    this.server.to(roomId).emit('userJoined', { nickname });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() { roomId, message }: { roomId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (client.data.user && !client.data.user.username.startsWith('Guest')) {
      // 로그인된 사용자만 메시지 전송 가능
      const sender = client.data.user?.username;
      this.server.to(roomId).emit('receiveMessage', { sender, message });
    } else {
      // 비로그인 사용자는 메시지 전송 불가
      client.emit('error', { message: 'You must be logged in to send messages.' });
    }
  }
}
