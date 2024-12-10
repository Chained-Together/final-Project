import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResolutionEntity } from './entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { IResolutionRepository } from 'src/interface/resolution-interface';
import { IVideoRepository } from 'src/interface/video-interface';

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
    highResolutionUrl: string,
    lowResolutionUrl: string,
  ): Promise<ResolutionEntity> {
    const video = await this.getVideoByCode(videoCode);
    await this.updateResolutionInfo(video.id, highResolutionUrl, lowResolutionUrl);
    await this.updateVideoMetadata(video.id, duration);
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

  private async updateResolutionInfo(
    videoId: number,
    highResolutionUrl: string,
    lowResolutionUrl: string,
  ): Promise<void> {
    const result = await this.resolutionRepository.updateResolution(
      videoId,
      highResolutionUrl,
      lowResolutionUrl,
    );
    if (result.affected === 0) {
      throw new Error('해상도 정보를 업데이트할 수 없습니다.');
    }
  }

  private async updateVideoMetadata(videoId: number, duration: number): Promise<void> {
    const result = await this.videoRepository.updateVideo(videoId, {
      duration: duration,
      status: true,
    });
    if (result.affected === 0) {
      throw new Error('비디오 메타데이터를 업데이트할 수 없습니다.');
    }
  }

  private async getUpdatedResolution(videoId: number): Promise<ResolutionEntity> {
    const resolution = await this.resolutionRepository.findResolutionByvideoId(videoId);
    if (!resolution) {
      throw new Error('업데이트된 해상도를 찾을 수 없습니다.');
    }
    return resolution;
  }
}
