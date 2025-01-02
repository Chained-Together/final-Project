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

@WebSocketGateway(3001, { namespace: '/socket.io/', cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger('ChatGateway');
  private chatRooms: Record<string, Set<string>> = {};

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const streamId = client.handshake.query.streamId as string;

      if (!token) {
        this.assignGuest(client, streamId);
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
        this.logger.warn(`Invalid token: ${error.message}`);
        this.assignGuest(client, streamId);
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
      this.logger.warn(`Unauthorized client tried to send a message.`);
      return;
    }

    const { streamId, message } = data;

    if (streamId) {
      this.server.to(streamId).emit('receiveMessage', {
        sender: client.data.nickname,
        message,
      });

      this.logger.log(`Message sent to stream ${streamId} by ${client.data.nickname}: ${message}`);
    }
  }

  handleDisconnect(client: Socket) {
    const { streamId } = client.data || {};
    if (streamId) {
      client.leave(streamId);
      this.logger.log(`Client ${client.id} left stream: ${streamId}`);
    }
  }

  private assignGuest(client: Socket, streamId: string) {
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
  }
}
