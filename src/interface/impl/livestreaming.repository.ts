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
    const checkTitle = this.repository.findOne({
      where: {
        user: { id: userId },
      },
    });

    if (checkTitle) {
      this.repository.delete({
        user: {
          id: userId,
        },
      });
    }

    return this.repository.create({
      title,
      user: { id: userId },
      user_id: userId,
    });
  }

  save(liveStreaming: LiveStreamingEntity): Promise<LiveStreamingEntity> {
    return this.repository.save(liveStreaming);
  }

  async findAllLiveStreams(): Promise<LiveStreamingEntity[]> {
    console.log('Executing findAllLiveStreams query...');

    const query = this.repository
      .createQueryBuilder('liveStreaming')
      .leftJoinAndSelect('liveStreaming.user', 'user')
      .leftJoinAndSelect('user.channel', 'channel')
      .leftJoinAndSelect('user.obsStreamKey', 'obsStreamKey')
      .where('obsStreamKey.status = :status', { status: true });

    console.log('Generated SQL:', query.getSql());
    console.log('Query parameters:', { status: true });

    const liveStreams = await query.getMany();
    console.log('Query result:', liveStreams);

    return liveStreams;
  }

  async findLiveStreamById(id: string): Promise<LiveStreamingEntity> {
    return await this.repository
      .createQueryBuilder('liveStreaming')
      .leftJoinAndSelect('liveStreaming.user', 'user')
      .leftJoinAndSelect('user.channel', 'channel')
      .leftJoinAndSelect('user.obsStreamKey', 'obsStreamKey')
      .where('liveStreaming.id = :id', { id })
      .andWhere('obsStreamKey.status = :status', { status: true })
      .getOne();
  }
}
