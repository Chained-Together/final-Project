import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { ChannelRepository } from 'src/interface/impl/channel.repository';
import { ResolutionRepository } from 'src/interface/impl/resolution.repository';
import { VideoRepository } from 'src/interface/impl/video.repository';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { VideoEntity } from './entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, ChannelEntity, ResolutionEntity])],
  controllers: [VideoController],
  providers: [
    VideoService,
    {
      provide: 'IVideoRepository',
      useClass: VideoRepository,
    },
    {
      provide: 'IChannelRepository',
      useClass: ChannelRepository,
    },
    {
      provide: 'IResolutionRepository',
      useClass: ResolutionRepository,
    },
  ],
})
export class VideoModule {}
