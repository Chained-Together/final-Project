import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IChannelRepository } from 'src/interface/channel-interface';
import { IResolutionRepository } from 'src/interface/resolution-interface';
import { IVideoRepository } from 'src/interface/video-interface';
import { UserEntity } from 'src/user/entities/user.entity';
import { UpdateVideoDto } from './dto/update.video.dto';
import { VideoDto } from './dto/video.dto';
import { VideoEntity } from './entities/video.entity';
import { Visibility } from './video.visibility.enum';

@Injectable()
export class VideoService {
  constructor(
    @Inject('IVideoRepository')
    private videoRepository: IVideoRepository,
    @Inject('IChannelRepository')
    private channelRepository: IChannelRepository,
    @Inject('IResolutionRepository')
    private resolutionRepository: IResolutionRepository,
  ) {}

  async getNewVideos(lastId: number, take: number) {
    return this.videoRepository.findNewVideos(lastId, take);
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

    const video = this.videoRepository.createVideo(
      title,
      description,
      thumbnailUrl,
      hashtags,
      duration,
      visibility,
      foundChannel,
      videoCode,
      accessKey,
    );

    const savedVideo = await this.videoRepository.saveVideo(video);

    const resolution = this.resolutionRepository.createResolution(high, low, savedVideo);

    await this.resolutionRepository.saveResolution(resolution);

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
    return this.videoRepository.findAllVideo();
  }

  async getAllVideoOfChannel(channelId: number): Promise<VideoEntity[]> {
    return this.videoRepository.findAllVideoByChannelAndVisibility(channelId);
  }

  async getAllVideoOfMyChannel(channelId: number, userId: number): Promise<VideoEntity[]> {
    const foundChannel = await this.channelRepository.findChannelByUserId(userId);

    if (!foundChannel) {
      throw new UnauthorizedException('해당 채널의 소유자가 아닙니다.');
    }

    return this.videoRepository.findAllVideoByChannelId(channelId);
  }

  async getVideo(
    videoId: number,
    userId?: number,
    accessKey?: string,
  ): Promise<VideoEntity | object> {
    const foundVideo = await this.videoRepository.findVideoWithChannelAndResolution(videoId);

    if (!foundVideo) {
      throw new NotFoundException('존재하지 않는 비디오입니다.');
    }

    const { visibility, channel, accessKey: storedAccessKey } = foundVideo;

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

    return foundVideo;
  }

  async updateVideo(
    user: UserEntity,
    videoId: number,
    updateVideoDto: UpdateVideoDto,
  ): Promise<VideoEntity> {
    await this.findChannelByUserId(user.id);

    const foundVideo = await this.findVideoById(videoId);

    const updateData = await this.updateDetails(updateVideoDto, foundVideo);

    await this.videoRepository.updateVideo(videoId, updateData);

    const updatedVideo = await this.videoRepository.findVideoByVideoId(videoId);
    return updatedVideo;
  }

  async deleteVideo(user: UserEntity, videoId: number): Promise<object> {
    await this.findChannelByUserId(user.id);

    await this.findVideoById(videoId);

    await this.videoRepository.deleteVideo(videoId);

    return { message: '동영상이 삭제되었습니다.' };
  }

  private async findChannelByUserId(id) {
    const foundChannel = await this.channelRepository.findChannelByUserId(id);
    if (!foundChannel) {
      throw new UnauthorizedException('채널이 존재하지 않습니다.');
    }
    return foundChannel;
  }

  private async findVideoById(id) {
    const foundVideo = await this.videoRepository.findVideoByVideoId(id);
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
    const videoResult = await this.videoRepository.findByKeyword(keyword);

    if (!videoResult.length) {
      return { message: '검색 결과가 없습니다.' };
    }

    return videoResult;
  }
}
