import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity, NotificationEntity, UserEntity])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
