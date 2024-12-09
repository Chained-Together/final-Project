import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { VideoEntity } from 'src/video/entities/video.entity';
import { Visibility } from 'src/video/video.visibility.enum';

export interface IVideoRepository {
  findVideoByVideoId(videoId: number): Promise<VideoEntity>;
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
  ): VideoEntity;
  saveVideo(video: VideoEntity): Promise<VideoEntity>;
}
