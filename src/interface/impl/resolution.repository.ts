import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { Repository, UpdateResult } from 'typeorm';
import { IResolutionRepository } from '../resolution-interface';

@Injectable()
export class ResolutionRepository implements IResolutionRepository {
  constructor(
    @InjectRepository(ResolutionEntity)
    private readonly repository: Repository<ResolutionEntity>,
  ) {}
  findResolutionByVideoId(videoId: number): Promise<ResolutionEntity | null> {
    return this.repository.findOne({
      where: { video: { id: videoId } },
    });
  }
  updateResolution(videoId: number, videoUrl: string): Promise<UpdateResult> {
    return this.repository.update(
      {
        video: { id: videoId },
      },
      { videoUrl },
    );
  }
  createResolution(video: VideoEntity): ResolutionEntity {
    return this.repository.create({
      video,
    });
  }
  saveResolution(resolution: ResolutionEntity): Promise<ResolutionEntity> {
    return this.repository.save(resolution);
  }
}
