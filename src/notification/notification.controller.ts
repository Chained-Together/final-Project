import { Controller, Delete, Get, Param, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtQueryAuthGuard } from 'src/utils/jwtquery-authguard';
import { UserInfo } from 'src/utils/user-info.decorator';
import { NotificationService } from './notification.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('알림 API') // Swagger 그룹 태그
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtQueryAuthGuard)
  @Sse('stream')
  @ApiOperation({
    summary: '실시간 알림 스트림',
    description:
      'SSE(Server-Sent Events)를 사용하여 실시간 알림을 스트리밍합니다. JWT 쿼리 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '실시간 알림 데이터가 스트리밍됩니다.',
  })
  stream(@UserInfo() user: UserEntity): Observable<MessageEvent> {
    console.log(`SSE 요청 수신 for userId: ${user.id}`);

    return this.notificationService.getNotificationStream(user.id).pipe(
      map((message: string) => {
        return {
          data: { message },
        } as MessageEvent;
      }),
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '알림 읽음 처리',
    description: '특정 알림을 읽음 상태로 업데이트합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '알림이 성공적으로 읽음 처리되었습니다.',
  })
  updateNotification(@Param('id') id: number) {
    return this.notificationService.updateNotification(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '이전 알림 조회',
    description: '사용자의 과거 알림 목록을 조회합니다. JWT 인증이 필요합니다.',
  })
  @ApiOkResponse({
    description: '과거 알림 목록이 반환됩니다.',
  })
  getPastNotifications(@UserInfo() user: UserEntity) {
    console.log('요청 0');
    return this.notificationService.getPastNotifications(user.id);
  }
}
