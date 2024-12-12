import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { Visibility } from 'src/video/video.visibility.enum';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IVideoRepository {
  findVideoByVideoId(videoId: number): Promise<VideoEntity>;
  createVideo(
    title: string,
    description: string,
    hashtags: string[],
    duration: number,
    visibility: Visibility,
    channel: ChannelEntity,
    videoCode: string,
    accessKey?: string,
  ): VideoEntity;
  saveVideo(video: VideoEntity): Promise<VideoEntity>;
  findAllVideo(): Promise<VideoEntity[]>;
  findAllVideoByChannelAndVisibility(channelId: number): Promise<VideoEntity[]>;
  findAllVideoByChannelId(channelId: number): Promise<VideoEntity[]>;
  findVideoWithChannelAndResolution(videoId: number): Promise<VideoEntity>;
  updateVideo(videoId: number, updateData: Partial<VideoEntity>): Promise<UpdateResult>;
  deleteVideo(videoId: number): Promise<DeleteResult>;
  findByKeyword(keyword: string): Promise<VideoEntity[]>;
  findNewVideos(lastId: number, take: number): Promise<VideoEntity[]>;
  findVideoByVideoCode(videoCode: string): Promise<VideoEntity | null>;
}
