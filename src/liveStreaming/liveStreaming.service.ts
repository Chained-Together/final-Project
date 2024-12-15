import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LiveStreamingDto } from './dto/create.liveStreaming';
import { IObsStreamKeyRepository } from 'src/interface/obs-interface';
import { ILiveStreamingRepository } from 'src/interface/livestreaming.interface';

@Injectable()
export class LiveStreamingService {
  constructor(
    @Inject('ILiveStreamingRepository')
    private readonly liveStreamingRepository: ILiveStreamingRepository,
    @Inject('IObsStreamKeyRepository')
    private readonly obsStreamingRepository: IObsStreamKeyRepository,
  ) {}

  async createLiveStreaming(userId: number, liveStreamingDto: LiveStreamingDto) {
    const { title } = liveStreamingDto;

    const checkStreamKey = await this.obsStreamingRepository.findObsStreamKeyByUserId(userId);
    if (!checkStreamKey) {
      throw new NotFoundException('해당하는 스트림키 가 없습니다.');
    }
    const liveStreaming = this.liveStreamingRepository.createLiveStreaming(title, userId);
    return await this.liveStreamingRepository.save(liveStreaming);
  }
  async getAllLiveStreams() {
    try {
      const liveStreams = await this.liveStreamingRepository.findAllLiveStreams();
      console.log('Found live streams:', liveStreams);

      if (liveStreams.length === 0) {
        return [];
      }

      return liveStreams.map((streamEntity) => {
        console.log('Processing stream entity:', streamEntity);
        return {
          id: streamEntity.id,
          title: streamEntity.title,
          profileImage: streamEntity.user?.channel?.profileImage,
          nickname: streamEntity.user?.nickname,
          channelName: streamEntity.user?.channel?.name,
          viewer: streamEntity.viewer,
        };
      });
    } catch (error) {
      console.error('Error in getAllLiveStreams:', error);
      throw error;
    }
  }
}
