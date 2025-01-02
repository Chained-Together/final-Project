// import { Logger } from '@nestjs/common';
// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
// import { createAdapter } from '@socket.io/redis-adapter';
// import { createClient } from 'redis';

// @WebSocketGateway(3001, { cors: { origin: '*' } })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly jwtService: JwtService,
//   ) {}
//   private readonly logger = new Logger('ChatGateway');
//   private chatRooms: Record<string, Set<string>> = {};

//   @WebSocketServer()
//   server: Server;

//   async afterInit() {
//     const redisUrl = this.configService.get('REDIS_URL') || 'redis://redis:6379';

//     const pubClient = createClient({
//       url: 'redis://redis:6379',
//       socket: {
//         host: 'redis',
//         port: 6379,
//         reconnectStrategy: (retries) => {
//           this.logger.log(`Redis 재연결 시도 ${retries}회`);
//           return Math.min(retries * 100, 3000);
//         },
//       },
//     });

//     pubClient.on('error', (err) => {
//       this.logger.error('Redis Client Error:', err);
//     });

//     pubClient.on('connect', () => {
//       this.logger.log('Redis에 연결되었습니다.');
//     });

//     const subClient = pubClient.duplicate();

//     try {
//       await Promise.all([pubClient.connect(), subClient.connect()]);

//       this.server.adapter(createAdapter(pubClient, subClient));
//       this.logger.log('Socket.IO Redis 어댑터가 설정되었습니다.');
//     } catch (error) {
//       this.logger.error('Redis 연결 실패:', error);
//       // 연결 실패시에도 서버는 계속 실행되도록 함
//       this.logger.warn('Redis 없이 계속 실행됩니다.');
//     }
//   }

//   async handleConnection(client: Socket) {
//     try {
//       const token = client.handshake.auth.token;
//       const streamId = client.handshake.query.streamId as string;

//       if (!token) {
//         client.data = {
//           userId: null,
//           nickname: 'Guest',
//           streamId,
//           readOnly: true,
//         };

//         if (streamId) {
//           client.join(streamId);
//           this.logger.log(`Guest joined stream: ${streamId} (read-only)`);
//         }
//         return;
//       }

//       try {
//         const secretKey = this.configService.get<string>('JWT_SECRET_KEY');
//         const decoded = await this.jwtService.verifyAsync(token, { secret: secretKey });

//         client.data = {
//           userId: decoded.sub,
//           nickname: decoded.nickname,
//           streamId,
//           readOnly: false,
//         };

//         if (streamId) {
//           client.join(streamId);
//           this.logger.log(`Client ${client.id} joined stream: ${streamId}`);
//         }
//       } catch (error) {
//         client.data = {
//           userId: null,
//           nickname: 'Guest',
//           streamId,
//           readOnly: true,
//         };

//         if (streamId) {
//           client.join(streamId);
//           this.logger.log(`Invalid token - Guest joined stream: ${streamId} (read-only)`);
//         }
//       }
//     } catch (error) {
//       this.logger.error(`Connection error: ${error.message}`);
//       client.disconnect();
//     }
//   }

//   @SubscribeMessage('sendMessage')
//   async handleMessage(
//     @MessageBody() data: { streamId: string; message: string },
//     @ConnectedSocket() client: Socket,
//   ) {
//     if (!client.data?.nickname || client.data.readOnly) {
//       return;
//     }

//     const { streamId, message } = data;

//     const pubClient = createClient({
//       url: 'redis://redis:6379',
//     });
//     await pubClient.connect();

//     await pubClient.publish(
//       'chat',
//       JSON.stringify({
//         roomId: streamId,
//         sender: client.data.nickname,
//         content: message,
//       }),
//     );

//     await pubClient.disconnect();
//   }

//   handleDisconnect(client: Socket) {
//     const { streamId } = client.data || {};
//     if (streamId) {
//       client.leave(streamId);
//       this.logger.log(`Client ${client.id} left stream: ${streamId}`);
//     }
//   }
// }

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { AddMessageDto } from './dto/add-messgae.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');

  @SubscribeMessage('chat')
  handleMessage(@MessageBody() payload: AddMessageDto): AddMessageDto {
    // this.logger.log(`Message received: ${payload.author} - ${payload.body}`);
    this.server.emit('chat', payload);
    return payload;
  }

  handleConnection(socket: Socket) {
    this.logger.log(`Socket connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Socket disconnected: ${socket.id}`);
  }
}
