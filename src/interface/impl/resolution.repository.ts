import { Injectable } from '@nestjs/common';
import { IResolutionRepository } from '../resolution-interface';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ResolutionRepository implements IResolutionRepository {
  constructor(
    @InjectRepository(ResolutionEntity)
    private readonly repository: Repository<ResolutionEntity>,
  ) {}
  findResolutionByvideoId(videoId: number): Promise<ResolutionEntity | null> {
    return this.repository.findOne({
      where: { video: { id: videoId } },
    });
  }
  updateResolution(
    videoId: number,
    highResolutionUrl: string,
    lowResolutionUrl: string,
  ): Promise<UpdateResult> {
    return this.repository.update(
      {
        video: { id: videoId },
      },
      { high: highResolutionUrl, low: lowResolutionUrl },
    );
  }
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
