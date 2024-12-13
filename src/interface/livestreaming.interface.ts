import { LiveStreamingEntity } from 'src/liveStreaming/entities/liveStreaming.entity';

export interface ILiveStreamingRepository {
  createLiveStreaming(title: string): LiveStreamingEntity;
  save(liveStreaming: LiveStreamingEntity): Promise<LiveStreamingEntity>;
}