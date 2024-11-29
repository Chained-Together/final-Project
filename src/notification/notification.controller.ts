import { Controller, Delete, Get, Param, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtQueryAuthGuard } from 'src/utils/jwtquery-authguard';
import { UserInfo } from 'src/utils/user-info.decorator';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtQueryAuthGuard)
  @Sse('stream')
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
  updateNotification(@Param('id') id: number) {
    return this.notificationService.updateNotification(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getPastNotifications(@UserInfo() user: UserEntity) {
    console.log('요청 0');
    return this.notificationService.getPastNotifications(user.id);
  }
}
