import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { ChannelRepository } from 'src/interface/impl/channel.repository';
import { LikeRepository } from 'src/interface/impl/like.repository';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { LikeEntity } from './entities/like.entity';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity, ChannelEntity, NotificationEntity, UserEntity]),
    EventEmitter2,
  ],
  controllers: [LikeController],
  providers: [
    LikeService,
    NotificationService,
    {
      provide: 'ILikeRepository',
      useClass: LikeRepository,
    },
    {
      provide: 'IChannelRepository',
      useClass: ChannelRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationEntity,
    },
  ],
})
export class LikeModule {}
