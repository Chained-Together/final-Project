import { ObsStreamKeyEntity } from 'src/obs/entities/obs.entity';
import { UpdateResult } from 'typeorm';

export interface IObsStreamKeyRepository {
  createObsStreamKey(userId: number, streamKey: string, streamingUrl: string): ObsStreamKeyEntity;
  save(streamKey: ObsStreamKeyEntity): Promise<ObsStreamKeyEntity>;
  findObsStreamKeyByUserId(userId: number): Promise<ObsStreamKeyEntity | null>;
  findByStreamKey(streamKey: string): Promise<ObsStreamKeyEntity | null>;
  updateStatusFalse(streamKey: string): Promise<UpdateResult>;
  updateStatusTrue(streamKey: string): Promise<UpdateResult>;
}
