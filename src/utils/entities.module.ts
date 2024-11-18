import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { ResolutionsEntity } from '../video/entities/resolutions.entity';
import { ChannelEntity } from '../channel/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, VideoEntity, ResolutionsEntity, ChannelEntity])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
