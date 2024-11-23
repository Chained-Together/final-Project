import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { VideoEntity } from './entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, ChannelEntity, ResolutionEntity])],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
