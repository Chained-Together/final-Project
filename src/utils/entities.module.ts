import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { UserEntity } from '../../src/user/entities/user.entity';
import { ChannelEntity } from '../channel/entities/channel.entity';
import { VideoEntity } from '../video/entities/video.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, VideoEntity, ResolutionEntity, ChannelEntity])],
  exports: [TypeOrmModule],
})
export class EntitiesModule {}
