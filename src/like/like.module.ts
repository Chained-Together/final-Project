import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeEntity } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { NotificationEntity } from 'src/notification/entities/notification.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeEntity, ChannelEntity, NotificationEntity, UserEntity]),
    EventEmitter2,
  ],
  controllers: [LikeController],
  providers: [LikeService, NotificationService],
})
export class LikeModule {}
