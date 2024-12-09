import { VideoEntity } from 'src/video/entities/video.entity';
import { IVideoRepository } from '../video-interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { Visibility } from 'src/video/video.visibility.enum';

export class VideoRepository implements IVideoRepository {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly repository: Repository<VideoEntity>,
  ) {}
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
    throw new Error('Method not implemented.');
  }
  saveVideo(video: VideoEntity): Promise<VideoEntity> {
    throw new Error('Method not implemented.');
  }
  findVideoByVideoId(videoId: number): Promise<VideoEntity> {
    return this.repository.findOne({ where: { id: videoId } });
  }
}
