import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ChannelEntity } from '../channel/entities/channel.entity';
import { ResolutionEntity } from 'src/resolution/entities/resolution.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { UpdateVideoDto } from './dto/update.video.dto';
import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';
import { Visibility } from './video.visibility.enum';

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

  async getNewVideos(lastId: number, take: number) {
    const query = this.videoRepository
      .createQueryBuilder('videos')
      .where('videos.visibility = :visibility', { visibility: 'public' })
      .andWhere('videos.status = :status', { status: true })
      .orderBy('videos.id', 'ASC')
      .take(take);

    if (lastId) {
      query.andWhere('videos.id > :lastId', { lastId });
    }

    const newVideos = await query.getMany();

    return newVideos;
  }

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

    const foundChannel = await this.findChannelByUserId(user.id);

    const accessKey = visibility === Visibility.UNLISTED ? this.generateAccessKey() : null;

    console.log(accessKey);
    const video = this.videoRepository.create({
      title,
      description,
      thumbnailUrl: thumbnailUrl,
      hashtags,
      duration,
      visibility,
      channel: foundChannel,
      videoCode,
      accessKey,
    });

    const savedVideo = await this.videoRepository.save(video);

    const resolution = this.resolutionRepository.create({
      videoUrl: null,
      video: savedVideo,
    });

    await this.resolutionRepository.save(resolution);

    return {
      key: videoCode,
      ...(accessKey && {
        link: `https://localhost:3000/video/${savedVideo.id}?accessKey=${accessKey}`,
      }),
    };
  }
  //TODO: 도메인 이름 넣기
  //프론트 일부공개 ,일부 공개시만 링크제공되는지 확인,람다 status 코드추가

  private generateAccessKey(): string {
    return `${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;
  }

  async getAllVideo(): Promise<VideoEntity[]> {
    return this.videoRepository.find();
  }

  async getAllVideoOfChannel(channelId: number): Promise<VideoEntity[]> {
    console.log('Channel ID:', channelId);
    return this.videoRepository.find({
      where: { channel: { id: channelId }, visibility: Visibility.PUBLIC },
    });
  }

  async getAllVideoOfMyChannel(channelId: number, userId: number): Promise<VideoEntity[]> {
    const foundChannel = await this.channelRepository.findOne({
      where: { id: channelId, user: { id: userId } },
    });

    if (!foundChannel) {
      throw new UnauthorizedException('해당 채널의 소유자가 아닙니다.');
    }

    return this.videoRepository.find({
      where: { channel: { id: channelId } },
    });
  }

  async getVideo(
    videoId: number,
    userId?: number,
    accessKey?: string,
  ): Promise<VideoEntity | object> {
    const foundVideo = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['channel', 'resolution'],
    });

    if (!foundVideo) {
      throw new NotFoundException('존재하지 않는 비디오입니다.');
    }

    const { visibility, channel, accessKey: storedAccessKey, resolution } = foundVideo;

    if (visibility === Visibility.PRIVATE && channel.user.id !== userId) {
      throw new UnauthorizedException('비공개 비디오에 접근할 수 없습니다.');
    }

    if (
      visibility === Visibility.UNLISTED &&
      channel.user.id !== userId &&
      storedAccessKey !== accessKey
    ) {
      throw new UnauthorizedException('올바른 링크가 아니면 접근할 수 없습니다.');
    }
    
    if(!resolution.videoUrl){
      throw new NotFoundException('해당하는 비디오URL을 찾을수없습니다.')
    }

    return {
      foundVideo,
      videoUrl: resolution.videoUrl,
    };
  }

  async updateVideo(
    user: UserEntity,
    videoId: number,
    updateVideoDto: UpdateVideoDto,
  ): Promise<VideoEntity> {
    await this.findChannelByUserId(user.id);

    const foundVideo = await this.findVideoById(videoId);

    const updateData = await this.updateDetails(updateVideoDto, foundVideo);

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
    const foundChannel = await this.channelRepository.findOne({
      where: { user: { id: id } },
    });
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

  private async updateDetails(updateVideoDto: UpdateVideoDto, foundVideo: VideoEntity) {
    const updateData: Partial<VideoEntity> = {};

    if (updateVideoDto.title) {
      updateData.title = updateVideoDto.title;
    }

    if (updateVideoDto.description) {
      updateData.description = updateVideoDto.description;
    }

    if (updateVideoDto.thumbnailUrl) {
      updateData.thumbnailUrl = updateVideoDto.thumbnailUrl;
    }

    if (updateVideoDto.hashtags) {
      updateData.hashtags = updateVideoDto.hashtags;
    }

    if (updateVideoDto.visibility) {
      updateData.visibility = updateVideoDto.visibility;
    }

    if (updateVideoDto.visibility === 'unlisted' && !foundVideo.accessKey) {
      updateData.accessKey = this.generateAccessKey();
    }

    return updateData;
  }

  async getVideoLink(id: number): Promise<object> {
    const foundVideo = await this.findVideoById(id);
    const accessKey = foundVideo.accessKey;
    const baseUrl = `http://localhost:3000`;

    let url;
    if (foundVideo.visibility === Visibility.PUBLIC) {
      url = `${baseUrl}/view-video?id=${foundVideo.id}`;
    }

    if (foundVideo.visibility === Visibility.UNLISTED) {
      url = `${baseUrl}/view-video?id=${foundVideo.id}?accessKey=${accessKey}`;
    }

    if (foundVideo.visibility === Visibility.PRIVATE) {
      url = `${baseUrl}/view-video?id=${foundVideo.id}`;
    }

    return { url, visibility: foundVideo.visibility };
  }

  async findVideoByKeyword(keyword: string) {
    const videoResult = await this.videoRepository
      .createQueryBuilder('video')
      .where('video.title LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('video.hashtags @> :keywordArray', { keywordArray: JSON.stringify([keyword]) })
      .andWhere('video.status = :status', { status: Visibility.PUBLIC })
      .getMany();

    if (!videoResult.length) {
      return { message: '검색 결과가 없습니다.' };
    }

    return videoResult;
  }
}
