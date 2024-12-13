import { InjectRepository } from '@nestjs/typeorm';
import { ObsStreamKeyEntity } from 'src/obs/entities/obs.entity';
import { Repository, UpdateResult } from 'typeorm';
import { IObsStreamKeyRepository } from '../obs-interface';

export class ObsStreamKeyRepository implements IObsStreamKeyRepository {
  constructor(
    @InjectRepository(ObsStreamKeyEntity)
    private readonly repository: Repository<ObsStreamKeyEntity>,
  ) {}

  createObsStreamKey(userId: number, streamKey: string): ObsStreamKeyEntity {
    return this.repository.create({
      user: { id: userId },
      streamKey: streamKey,
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

  findByStreamKey(streamKey: string): Promise<ObsStreamKeyEntity | null> {
    return this.repository.findOne({
      where: {
        streamKey: streamKey,
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
