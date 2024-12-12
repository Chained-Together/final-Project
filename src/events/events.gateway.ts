import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // socket.io의 타입을 가져옴

@WebSocketGateway(3000, {
  namespace: 'chat',
  cors: { origin: '*' }, // CORS 설정
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('EventsGateway');

  @WebSocketServer() server: Server; // WebSocket 서버의 인스턴스 타입을 socket.io의 Server로 설정

  // WebSocket 이벤트 처리
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    this.logger.log(`Received event from client (${client.id}): ${data}`);
    return data; // 클라이언트에게 동일한 데이터를 반환
  }

  // WebSocket 서버 초기화
  afterInit(server: Server) {
    this.logger.log('WebSocket 서버 초기화 완료 ✅');
  }

  // 클라이언트 연결 종료 처리
  handleDisconnect(client: Socket) {
    this.logger.log(`클라이언트 연결 종료: ${client.id}`);
  }

  // 클라이언트 연결 처리
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`클라이언트 연결 성공: ${client.id}`);
  }
}
