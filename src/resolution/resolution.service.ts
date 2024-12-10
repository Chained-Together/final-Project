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
    thumbnail: string,
    videoUrl: string,
  ): Promise<ResolutionEntity> {
    console.log('updateResolution 호출됨');
    console.log('전달받은 videoCode:', videoCode);
    console.log('전달받은 duration:', duration);
    console.log('전달받은 videoUrl:', videoUrl);
    console.log('전달받은 thumbnail:', thumbnail);

    // 1. 비디오 찾기
    const findVideo = await this.videoRepository.findOne({ where: { videoCode } });

    if (!findVideo) {
      console.error('비디오를 찾을 수 없습니다. videoCode:', videoCode);
      throw new NotFoundException('해당하는 코드와 일치하는 영상이 존재하지 않습니다.');
    }

    console.log('찾은 비디오 데이터:', findVideo);

    // 2. 해상도 업데이트
    const resolutionUpdateResult = await this.resolutionRepository.update(
      {
        video: { id: findVideo.id },
      },
      { videoUrl: videoUrl },
    );

    if (resolutionUpdateResult.affected === 0) {
      throw new Error('해상도 정보를 업데이트할 수 없습니다.');
    }

    const videoUpdateResult = await this.videoRepository.update(
      { id: findVideo.id },
      { duration: duration, status: true, thumbnailUrl: thumbnail },
    );

    if (videoUpdateResult.affected === 0) {
      throw new Error('비디오 메타데이터를 업데이트할 수 없습니다.');
    }

    const findResolution = await this.resolutionRepository.findOne({
      where: { video: { id: findVideo.id } },
    });

    console.log('저장된 해상도 데이터:', findResolution);

    if (!findResolution) {
      throw new Error('업데이트된 해상도를 찾을 수 없습니다.');
    }

    return findResolution;
  }
}
