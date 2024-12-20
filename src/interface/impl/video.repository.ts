import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { Visibility } from 'src/video/video.visibility.enum';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IVideoRepository } from '../video-interface';

@Injectable()
export class VideoRepository implements IVideoRepository {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly repository: Repository<VideoEntity>,
  ) {}
  findVideoByVideoCode(videoCode: string): Promise<VideoEntity | null> {
    console.log('videoRepository:videoCode~~~~', videoCode);
    return this.repository.findOne({ where: { videoCode } });
  }

  findAllVideo(): Promise<VideoEntity[]> {
    return this.repository.find();
  }
  findAllVideoByChannelAndVisibility(channelId: number): Promise<VideoEntity[]> {
    return this.repository.find({
      where: { channel: { id: channelId }, visibility: Visibility.PUBLIC },
    });
  }
  findAllVideoByChannelId(channelId: number): Promise<VideoEntity[]> {
    return this.repository.find({
      where: { channel: { id: channelId } },
    });
  }
  findVideoByVideoId(videoId: number): Promise<VideoEntity> {
    return this.repository.findOne({
      where: { id: videoId },
    });
  }
  findVideoWithChannelAndResolution(videoId: number): Promise<VideoEntity> {
    return this.repository.findOne({
      where: { id: videoId },
      relations: ['channel', 'channel.user', 'resolution'],
      select: {
        channel: {
          id: true,
          name: true,
          profileImage: true,
          user: {
            id: true,
            email: true,
            name: true,
            nickname: true,
            // password와 phoneNumber는 제외
          },
        },
      },
    });
  }
  updateVideo(videoId: number, updateData: Partial<VideoEntity>): Promise<UpdateResult> {
    return this.repository.update({ id: videoId }, updateData);
  }
  deleteVideo(videoId: number): Promise<DeleteResult> {
    return this.repository.delete({ id: videoId });
  }
  findByKeyword(keyword: string): Promise<VideoEntity[]> {
    return this.repository
      .createQueryBuilder('videos')
      .where('videos.visibility = :visibility', { visibility: 'public' })
      .andWhere('videos.title LIKE :keyword', { keyword: `%${keyword}%` })
      .andWhere('videos.status = :status', { status: true })
      .orWhere(
        '(videos.visibility = :visibility AND videos.status = :status AND videos.hashtags @> :keywordArray)',
        {
          visibility: 'public',
          status: true,
          keywordArray: JSON.stringify([keyword]),
        },
      )
      .getMany();
  }
  async findNewVideos(lastId: number, take: number): Promise<VideoEntity[]> {
    const query = this.repository
      .createQueryBuilder('videos')
      .where('videos.visibility = :visibility', { visibility: 'public' })
      .andWhere('videos.status = :status', { status: true })
      .orderBy('videos.id', 'ASC')
      .take(take);

    if (lastId) {
      query.andWhere('videos.id > :lastId', { lastId });
    }

    return await query.getMany();
  }
  createVideo(
    title: string,
    description: string,
    hashtags: string[],
    duration: number,
    visibility: Visibility,
    channel: ChannelEntity,
    videoCode: string,
    accessKey?: string,
  ): VideoEntity {
    return this.repository.create({
      title,
      description,
      hashtags,
      duration,
      visibility,
      channel,
      videoCode,
      accessKey,
    });
  }
  saveVideo(video: VideoEntity): Promise<VideoEntity> {
    return this.repository.save(video);
  }
}
