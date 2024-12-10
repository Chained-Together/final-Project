import { Injectable } from '@nestjs/common';
import { IResolutionRepository } from '../resolution-interface';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ResolutionRepository implements IResolutionRepository {
  constructor(
    @InjectRepository(ResolutionEntity)
    private readonly repository: Repository<ResolutionEntity>,
  ) {}
  createResolution(high: string, low: string, video: VideoEntity): ResolutionEntity {
    return this.repository.create({
      high,
      low,
      video,
    });
  }
  saveResolution(resolution: ResolutionEntity): Promise<ResolutionEntity> {
    return this.repository.save(resolution);
  }
}
