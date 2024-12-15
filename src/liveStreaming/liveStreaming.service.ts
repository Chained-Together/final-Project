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
      console.log('Fetching live streams...');
      const liveStreams = await this.liveStreamingRepository.findAllLiveStreams();
      console.log('Raw live streams data:', JSON.stringify(liveStreams, null, 2));

      if (liveStreams.length === 0) {
        console.log('No live streams found');
        return [];
      }

      const mappedStreams = liveStreams.map((streamEntity) => {
        console.log('Processing stream:', {
          id: streamEntity.id,
          title: streamEntity.title,
          user: streamEntity.user,
          channel: streamEntity.user?.channel,
        });

        return {
          id: streamEntity.id,
          title: streamEntity.title,
          profileImage: streamEntity.user?.channel?.profileImage,
          nickname: streamEntity.user?.nickname,
          channelName: streamEntity.user?.channel?.name,
          viewer: streamEntity.viewer,
        };
      });

      console.log('Mapped streams:', JSON.stringify(mappedStreams, null, 2));
      return mappedStreams;
    } catch (error) {
      console.error('Error in getAllLiveStreams:', error);
      throw error;
    }
  }
}
