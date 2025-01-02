import { Inject, Injectable } from '@nestjs/common';
import { IObsStreamKeyRepository } from 'src/interface/obs-interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class ObsService {
  constructor(
    @Inject('IObsStreamKeyRepository')
    private readonly obsStreamKeyRepository: IObsStreamKeyRepository,
  ) {}
  async getUserStreamKey(userId: number) {
    try {
      const checkStreamKey = await this.obsStreamKeyRepository.findObsStreamKeyByUserId(userId);

      if (!checkStreamKey) {
        let randomStreamKey;
        let isUnique = false;

        // 고유한 스트림 키 생성
        while (!isUnique) {
          randomStreamKey = uuidv4().slice(0, 8);
          const existingKey = await this.obsStreamKeyRepository.findByStreamKey(randomStreamKey);
          isUnique = !existingKey;
        }
        const src = process.env.VIDEO_SRC;
        const streamingUrl = `https://${src}/hls/${randomStreamKey}.m3u8`;

        const createStreamKey = this.obsStreamKeyRepository.createObsStreamKey(
          userId,
          randomStreamKey,
          streamingUrl,
        );

        return await this.obsStreamKeyRepository.save(createStreamKey);
      }

      return checkStreamKey;
    } catch (error) {
      throw new Error(`Failed to get or create stream key: ${error.message}`);
    }
  }

  async verifyStreamKey(streamKey: string): Promise<boolean> {
    const keyEntity = await this.obsStreamKeyRepository.findByStreamKey(streamKey);

    if (!keyEntity) {
      return false;
    }

    await this.obsStreamKeyRepository.updateStatusTrue(streamKey);

    return true;
  }

  async handleStreamDone(streamKey: string): Promise<void> {
    await this.obsStreamKeyRepository.updateStatusFalse(streamKey);
  }
}
