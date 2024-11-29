import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from 'src/video/entities/video.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentEntity } from './entities/comment.entity';
import { NotificationService } from 'src/notification/notification.service';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { UserEntity } from 'src/user/entities/user.entity';

import { EventEmitter2 } from '@nestjs/event-emitter';

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
  providers: [CommentService, NotificationService],
})
export class CommentModule {}
