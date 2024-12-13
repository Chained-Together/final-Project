import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IResolutionRepository } from 'src/interface/resolution-interface';
import { IVideoRepository } from 'src/interface/video-interface';
import { VideoEntity } from 'src/video/entities/video.entity';
import { ResolutionEntity } from './entities/resolution.entity';

@Injectable()
export class ResolutionService {
  constructor(
    @Inject('IResolutionRepository')
    private readonly resolutionRepository: IResolutionRepository,
    @Inject('IVideoRepository')
    private readonly videoRepository: IVideoRepository,
  ) {}

  async updateResolution(
    videoCode: string,
    duration: number,
    thumbnail: string,
    videoUrl: string,
  ): Promise<ResolutionEntity> {
    const video = await this.getVideoByCode(videoCode);
    console.log('updateResolution:getvideoByCode', video);
    await this.updateResolutionInfo(video.id, videoUrl);
    await this.updateVideoMetadata(video.id, duration, thumbnail);
    return await this.getUpdatedResolution(video.id);
  }

  private async getVideoByCode(videoCode: string): Promise<VideoEntity> {
    const video = await this.videoRepository.findVideoByVideoCode(videoCode);
    if (!video) {
      console.error('비디오를 찾을 수 없습니다. videoCode:', videoCode);
      throw new NotFoundException('해당하는 코드와 일치하는 영상이 존재하지 않습니다.');
    }
    return video;
  }

  private async updateResolutionInfo(videoId: number, videoUrl: string): Promise<void> {
    const result = await this.resolutionRepository.updateResolution(videoId, videoUrl);
    console.log('updateResolutionInfo:updateResolution', result);
    if (result.affected === 0) {
      throw new Error('해상도 정보를 업데이트할 수 없습니다.');
    }
  }

  private async updateVideoMetadata(
    videoId: number,
    duration: number,
    thumbnailUrl: string,
  ): Promise<void> {
    const result = await this.videoRepository.updateVideo(videoId, {
      duration: duration,
      status: true,
      thumbnailUrl: thumbnailUrl,
    });
    console.log('updateVideoMetadata:updateVideo', result);
    if (result.affected === 0) {
      throw new Error('비디오 메타데이터를 업데이트할 수 없습니다.');
    }
  }

  private async getUpdatedResolution(videoId: number): Promise<ResolutionEntity> {
    const resolution = await this.resolutionRepository.findResolutionByVideoId(videoId);
    console.log('getUpdatedResolution:findResolutionByVideoId', resolution);
    if (!resolution) {
      throw new Error('업데이트된 해상도를 찾을 수 없습니다.');
    }
    return resolution;
  }
}
