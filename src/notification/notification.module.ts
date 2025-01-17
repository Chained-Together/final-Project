import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ChannelRepository } from 'src/interface/impl/channel.repository';
import { NotificationRepository } from '../interface/impl/notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity, NotificationEntity, UserEntity])],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: 'IChannelRepository',
      useClass: ChannelRepository,
    },
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
  ],
})
export class NotificationModule {}
