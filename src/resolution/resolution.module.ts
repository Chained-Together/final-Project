import { Module } from '@nestjs/common';
import { ResolutionService } from './resolution.service';
import { ResolutionController } from './resolution.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoEntity } from 'src/video/entities/video.entity';
import { ResolutionEntity } from './entities/resolution.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, ResolutionEntity])],
  controllers: [ResolutionController],
  providers: [ResolutionService],
})
export class ResolutionModule {}
