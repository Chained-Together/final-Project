import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolutionRepository } from 'src/interface/impl/resolution.repository';
import { VideoRepository } from 'src/interface/impl/video.repository';
import { VideoEntity } from 'src/video/entities/video.entity';
import { ResolutionEntity } from './entities/resolution.entity';
import { ResolutionController } from './resolution.controller';
import { ResolutionService } from './resolution.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, ResolutionEntity])],
  controllers: [ResolutionController],
  providers: [
    ResolutionService,
    {
      provide: 'IResolutionRepository',
      useClass: ResolutionRepository,
    },
    {
      provide: 'IVideoRepository',
      useClass: VideoRepository,
    },
  ],
})
export class ResolutionModule {}
