import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';

export interface IResolutionRepository {
  createResolution(high: string, low: string, video: VideoEntity): ResolutionEntity;
  saveResolution(resolution: ResolutionEntity): Promise<ResolutionEntity>;
}
