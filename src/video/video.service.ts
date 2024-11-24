import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../channel/entities/channel.entity';
import { UserEntity } from '../user/entity/user.entity';
import { UpdateVideoDto } from './dto/update.video.dto';
import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private videoRepository: Repository<VideoEntity>,
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ResolutionEntity)
    private resolutionRepository: Repository<ResolutionEntity>,
  ) {}

  async saveMetadata(user: UserEntity, videoDto: VideoDto): Promise<object> {
    const {
      title,
      description,
      thumbnailUrl,
      hashtags,
      duration,
      visibility,
      high,
      low,
      videoCode,
    } = videoDto;

    console.log(`비디오DTO:${videoDto}`);

    const foundChannel = await this.findChannelByUserId(user.id);

    const video = this.videoRepository.create({
      title,
      description,
      thumbnailUrl: thumbnailUrl,
      hashtags,
      duration,
      visibility,
      channel: foundChannel,
      videoCode,
    });

    const savedVideo = await this.videoRepository.save(video);

    const resolution = this.resolutionRepository.create({
      high,
      low,
      video: savedVideo,
    });

    await this.resolutionRepository.save(resolution);

    return { key: videoCode };
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

  async updateVideo(
    user: UserEntity,
    videoId: number,
    updateVideoDto: UpdateVideoDto,
  ): Promise<VideoEntity> {
    await this.findChannelByUserId(user.id);

    await this.findVideoById(videoId);

    const updateData = await this.updateDetails(updateVideoDto);

    await this.videoRepository.update({ id: videoId }, updateData);

    const updatedVideo = await this.videoRepository.findOne({ where: { id: videoId } });
    return updatedVideo;
  }

  async deleteVideo(user: UserEntity, videoId: number): Promise<object> {
    await this.findChannelByUserId(user.id);

    await this.findVideoById(videoId);

    await this.videoRepository.delete({
      id: videoId,
    });

    return { message: '동영상이 삭제되었습니다.' };
  }

  private async findChannelByUserId(id) {
    const foundChannel = await this.channelRepository.findOne({ where: { userId: id } });
    if (!foundChannel) {
      throw new UnauthorizedException('채널이 존재하지 않습니다.');
    }
    return foundChannel;
  }

  private async findVideoById(id) {
    const foundVideo = await this.videoRepository.findOne({
      where: { id: id },
    });
    if (!foundVideo) {
      throw new NotFoundException('존재 하지 않는 비디오 입니다.');
    }
    return foundVideo;
  }

  private async updateDetails(updateVideoDto: UpdateVideoDto) {
    const updateData: Partial<VideoEntity> = {};

    if (updateVideoDto.title) {
      updateData.title = updateVideoDto.title;
    }

    if (updateVideoDto.description) {
      updateData.description = updateVideoDto.description;
    }

    if (updateVideoDto.thumbnailURL) {
      updateData.thumbnailUrl = updateVideoDto.thumbnailURL;
    }

    if (updateVideoDto.hashtags) {
      updateData.hashtags = updateVideoDto.hashtags;
    }

    if (updateVideoDto.visibility) {
      updateData.visibility = updateVideoDto.visibility;
    }

    return updateData;
  }
}
