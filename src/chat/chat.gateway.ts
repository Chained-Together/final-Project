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
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

@WebSocketGateway(3001, { cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger('ChatGateway');
  private chatRooms: Record<string, Set<string>> = {};

  @WebSocketServer()
  server: Server;

  async afterInit() {
    const pubClient = createClient({
      url: 'redis://localhost:6379',
      socket: {
        host: 'localhost',
        port: 6379,
        reconnectStrategy: (retries) => {
          if (retries > 20) return new Error('Redis 연결 실패');
          return Math.min(retries * 100, 3000);
        },
      },
    });
    const subClient = pubClient.duplicate();

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.server.adapter(createAdapter(pubClient, subClient));

      await subClient.subscribe('chat', (message) => {
        const { roomId, sender, content } = JSON.parse(message);
        this.server.to(roomId).emit('receiveMessage', {
          sender,
          message: content,
          timestamp: new Date(),
        });
      });

      this.logger.log('Socket.IO Redis 어댑터가 설정되었습니다.');
    } catch (error) {
      this.logger.error('Redis 연결 실패:', error);
    }
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const streamId = client.handshake.query.streamId as string;

      if (!token) {
        client.data = {
          userId: null,
          nickname: 'Guest',
          streamId,
          readOnly: true,
        };

        if (streamId) {
          client.join(streamId);
          this.logger.log(`Guest joined stream: ${streamId} (read-only)`);
        }
        return;
      }

      try {
        const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
        const decoded = await this.jwtService.verifyAsync(token, { secret: secretKey });

        client.data = {
          userId: decoded.sub,
          nickname: decoded.nickname,
          streamId,
          readOnly: false,
        };

        if (streamId) {
          client.join(streamId);
          this.logger.log(`Client ${client.id} joined stream: ${streamId}`);
        }
      } catch (error) {
        client.data = {
          userId: null,
          nickname: 'Guest',
          streamId,
          readOnly: true,
        };

        if (streamId) {
          client.join(streamId);
          this.logger.log(`Invalid token - Guest joined stream: ${streamId} (read-only)`);
        }
      }
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { streamId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    if (!client.data?.nickname || client.data.readOnly) {
      return;
    }

    const { streamId, message } = data;

    const pubClient = createClient({
      url: 'redis://localhost:6379',
    });
    await pubClient.connect();

    await pubClient.publish(
      'chat',
      JSON.stringify({
        roomId: streamId,
        sender: client.data.nickname,
        content: message,
      }),
    );

    await pubClient.disconnect();
  }

  handleDisconnect(client: Socket) {
    const { streamId } = client.data || {};
    if (streamId) {
      client.leave(streamId);
      this.logger.log(`Client ${client.id} left stream: ${streamId}`);
    }
  }
}
