import { LiveStreamingEntity } from 'src/liveStreaming/entities/liveStreaming.entity';

export interface ILiveStreamingRepository {
  createLiveStreaming(title: string, userId: number): LiveStreamingEntity;
  save(liveStreaming: LiveStreamingEntity): Promise<LiveStreamingEntity>;
  findAllLiveStreams(): Promise<LiveStreamingEntity[]>;
  findLiveStreamById(id: string): Promise<LiveStreamingEntity>;
}
