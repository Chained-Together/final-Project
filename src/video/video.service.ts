import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoEntity } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { channel } from 'diagnostics_channel';
import { VideoDto } from './dto/video.dto';
import { Visibility } from './video.visibility.enum';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
  ) {}

  async createVideo(videoDto: VideoDto): Promise<VideoEntity> {
    const { title, description, thumbnailURL, hashtags, duration, visibility } = videoDto;

    const video = this.videoRepository.create({
      title,
      description,
      thumbnailURL,
      hashtags,
      duration,
      visibility,
    });

    const saveVideo = this.videoRepository.save(video);
    return saveVideo;
  }

  async getAllVideo(): Promise<VideoEntity[]> {
    return this.videoRepository.find();
  }

  async getVideo(videoId: number): Promise<VideoEntity> {
    const foundVideo = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['channel'],
    });

    if (!foundVideo) {
      throw new NotFoundException('존재 하지 않는 비디오 입니다.');
    }

    return foundVideo;
  }

  async updateVideo(videoId: number, updateVideoDto): Promise<VideoEntity> {
    const foundVideo = await this.videoRepository.findOne({
      where: { id: videoId },
    });
    if (!foundVideo) {
      throw new NotFoundException('존재 하지 않는 비디오 입니다.');
    }

    const updateData = await this.updateDetails(updateVideoDto);

    await this.videoRepository.update({ id: videoId }, updateData);

    const updatedVideo = await this.videoRepository.findOne({ where: { id: videoId } });
    return updatedVideo;
  }

  async deleteVideo(videoId: number): Promise<object> {
    const foundVideo = await this.videoRepository.findOne({
      where: { id: videoId },
    });
    if (!foundVideo) {
      throw new NotFoundException('존재 하지 않는 비디오 입니다.');
    }

    await this.videoRepository.delete({
      id: videoId,
    });

    return { message: '동영상이 삭제되었습니다.' };
  }

  private async updateDetails(updateVideoDto) {
    const updateData: Partial<VideoEntity> = {};

    if (updateVideoDto.title) {
      updateData.title = updateVideoDto.title;
    }

    if (updateVideoDto.description) {
      updateData.description = updateVideoDto.description;
    }

    if (updateVideoDto.thumbnail_url) {
      updateData.description = updateVideoDto.thumbnail_url;
    }

    if (updateVideoDto.visibility) {
      updateData.visibility = updateVideoDto.visibility;
    }

    return updateData;
  }
}
