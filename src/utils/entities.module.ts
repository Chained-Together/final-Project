import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { VideoEntity } from '../video/entities/video.entity';
import { ChannelEntity } from '../channel/entities/channel.entity';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VideoEntity, ResolutionEntity, ChannelEntity])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
