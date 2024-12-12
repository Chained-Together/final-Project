import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';

import { EventEmitter2 } from '@nestjs/event-emitter';
import { commentRepository } from 'src/interface/impl/comment.repositroy';
import { VideoRepository } from 'src/interface/impl/video.repository';
import { channelRepository } from 'src/interface/impl/channel.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      VideoEntity,
      ChannelEntity,
      NotificationEntity,
      UserEntity,
    ]),
    EventEmitter2,
  ],
  controllers: [CommentController],
  providers: [
    CommentService,
    NotificationService,
    {
      provide: 'ICommentRepository',
      useClass: commentRepository,
    },
    {
      provide: 'IVideoRepository',
      useClass: VideoRepository,
    },
    {
      provide: 'IChannelRepository',
      useClass: channelRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationEntity,
    },
  ],
})
export class CommentModule {}
