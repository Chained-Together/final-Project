import { InjectRepository } from '@nestjs/typeorm';
import { ILiveStreamingRepository } from '../livestreaming.interface';
import { LiveStreamingEntity } from 'src/liveStreaming/entities/liveStreaming.entity';
import { Repository } from 'typeorm';

export class LiveStreamingRepository implements ILiveStreamingRepository {
  constructor(
    @InjectRepository(LiveStreamingEntity)
    private readonly repository: Repository<LiveStreamingEntity>,
  ) {}

  createLiveStreaming(title: string): LiveStreamingEntity {
    return this.repository.create({ title });
  }

  save(liveStreaming: LiveStreamingEntity): Promise<LiveStreamingEntity> {
    return this.repository.save(liveStreaming);
  }
}
