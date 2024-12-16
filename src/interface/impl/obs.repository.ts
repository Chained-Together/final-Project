import { InjectRepository } from '@nestjs/typeorm';
import { ObsStreamKeyEntity } from 'src/obs/entities/obs.entity';
import { Repository, UpdateResult } from 'typeorm';
import { IObsStreamKeyRepository } from '../obs-interface';

export class ObsStreamKeyRepository implements IObsStreamKeyRepository {
  constructor(
    @InjectRepository(ObsStreamKeyEntity)
    private readonly repository: Repository<ObsStreamKeyEntity>,
  ) {}

  createObsStreamKey(userId: number, streamKey: string, streamingUrl: string): ObsStreamKeyEntity {
    return this.repository.create({
      user: { id: userId },
      streamKey: streamKey,
      streamingUrl,
    });
  }

  save(streamKey: ObsStreamKeyEntity): Promise<ObsStreamKeyEntity> {
    return this.repository.save(streamKey);
  }

  findObsStreamKeyByUserId(userId: number): Promise<ObsStreamKeyEntity | null> {
    return this.repository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  findByStreamKey(streamKey: string, userId: number): Promise<ObsStreamKeyEntity | null> {
    return this.repository.findOne({
      where: {
        streamKey: streamKey,
        user: { id: userId },
      },
    });
  }

  updateStatusFalse(streamKey: string): Promise<UpdateResult> {
    return this.repository.update({ streamKey: streamKey }, { status: false });
  }

  updateStatusTrue(streamKey: string): Promise<UpdateResult> {
    return this.repository.update({ streamKey: streamKey }, { status: true });
  }
}
