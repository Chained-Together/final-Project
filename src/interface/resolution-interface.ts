import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { UpdateResult } from 'typeorm';

export interface IResolutionRepository {
  createResolution(video: VideoEntity): ResolutionEntity;
  saveResolution(resolution: ResolutionEntity): Promise<ResolutionEntity>;
  updateResolution(videoId: number, videoUrl: string): Promise<UpdateResult>;
  findResolutionByVideoId(videoId: number): Promise<ResolutionEntity | null>;
}
