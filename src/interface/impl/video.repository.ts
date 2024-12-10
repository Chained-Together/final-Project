import { VideoEntity } from 'src/video/entities/video.entity';
import { IVideoRepository } from '../video-interface';
import { DeleteResult, Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { Visibility } from 'src/video/video.visibility.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VideoRepository implements IVideoRepository {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly repository: Repository<VideoEntity>,
  ) {}
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
  findVideoWithChannelAndResolution(videoId: number): Promise<VideoEntity> {
    return this.repository.findOne({
      where: { id: videoId },
      relations: ['channel', 'resolution'],
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
      .createQueryBuilder('video')
      .where('video.title LIKE :keyword', { keyword: `%${keyword}%` })
      .orWhere('video.hashtags @> :keywordArray', { keywordArray: JSON.stringify([keyword]) })
      .andWhere('video.status = :status', { status: Visibility.PUBLIC })
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
    thumbnailUrl: string,
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
      thumbnailUrl,
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
  findVideoByVideoId(videoId: number): Promise<VideoEntity> {
    return this.repository.findOne({ where: { id: videoId } });
  }
}
