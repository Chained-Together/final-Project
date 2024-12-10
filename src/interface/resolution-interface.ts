import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { UpdateResult } from 'typeorm';

export interface IResolutionRepository {
  createResolution(high: string, low: string, video: VideoEntity): ResolutionEntity;
  saveResolution(resolution: ResolutionEntity): Promise<ResolutionEntity>;
  updateResolution(
    videoId: number,
    highResolutionUrl: string,
    lowResolutionUrl: string,
  ): Promise<UpdateResult>;
  findResolutionByvideoId(videoId: number): Promise<ResolutionEntity | null>;
}
