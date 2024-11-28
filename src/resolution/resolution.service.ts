import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResolutionEntity } from './entities/resolution.entity';
import { VideoEntity } from 'src/video/entities/video.entity';

@Injectable()
export class ResolutionService {
  constructor(
    @InjectRepository(ResolutionEntity)
    private readonly resolutionRepository: Repository<ResolutionEntity>,
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  async updateResolution(
    videoCode: string,
    duration: number,
    highResolutionUrl: string,
    lowResolutionUrl: string,
  ): Promise<ResolutionEntity> {
    try {
      console.log('updateResolution 호출됨');
      console.log('전달받은 videoCode:', videoCode);
      console.log('전달받은 duration:', duration);
      console.log('전달받은 highResolutionUrl:', highResolutionUrl);
      console.log('전달받은 highResolutionUrl:', lowResolutionUrl);

      // 1. 비디오 찾기
      const findVideo = await this.videoRepository.findOne({ where: { videoCode } });

      if (!findVideo) {
        console.error('비디오를 찾을 수 없습니다. videoCode:', videoCode);
        throw new NotFoundException('해당하는 코드와 일치하는 영상이 존재하지 않습니다.');
      }

      console.log('찾은 비디오 데이터:', findVideo);

      // 2. 해상도 업데이트
      await this.resolutionRepository.update(
        {
          video: { id: findVideo.id }, // 관계 매핑
        },
        { high: highResolutionUrl, low: lowResolutionUrl },
      );

      await this.videoRepository.update({ id: findVideo.id }, { duration: duration, status: true });

      const findResolution = await this.resolutionRepository.findOne({
        where: { video: { id: findVideo.id } },
      });

      console.log('저장된 해상도 데이터:', findResolution);

      return findResolution;
    } catch (error) {
      console.error('updateResolution 처리 중 오류 발생:', error.message);
      throw error; // 예외를 그대로 던져 호출한 곳에서 처리할 수 있도록 유지
    }
  }
}
