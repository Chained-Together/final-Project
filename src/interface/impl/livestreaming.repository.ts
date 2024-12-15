import { InjectRepository } from '@nestjs/typeorm';
import { ILiveStreamingRepository } from '../livestreaming.interface';
import { LiveStreamingEntity } from 'src/liveStreaming/entities/liveStreaming.entity';
import { Repository } from 'typeorm';

export class LiveStreamingRepository implements ILiveStreamingRepository {
  constructor(
    @InjectRepository(LiveStreamingEntity)
    private readonly repository: Repository<LiveStreamingEntity>,
  ) {}

  createLiveStreaming(title: string, userId: number): LiveStreamingEntity {
    return this.repository.create({
      title,
      user: { id: userId },
    });
  }

  save(liveStreaming: LiveStreamingEntity): Promise<LiveStreamingEntity> {
    return this.repository.save(liveStreaming);
  }

  async findAllLiveStreams(): Promise<LiveStreamingEntity[]> {
    return await this.repository
      .createQueryBuilder('liveStreaming')
      .leftJoinAndSelect('liveStreaming.user', 'user')
      .leftJoinAndSelect('user.obsStreamKey', 'obsStreamKey')
      .leftJoinAndSelect('user.channel', 'channel')
      .where('obsStreamKey.status = :status', { status: true })
      .getMany();
  }
}
