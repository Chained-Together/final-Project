import { Module } from '@nestjs/common';
import { LiveStreamingEntity } from './entities/liveStreaming.entity';
import { LiveStreamingController } from './liveStreaming.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiveStreamingService } from './liveStreaming.service';
import { ObsStreamKeyRepository } from 'src/interface/impl/obs.repository';
import { LiveStreamingRepository } from 'src/interface/impl/livestreaming.repository';
import { ObsService } from 'src/obs/obs.service';
import { ObsStreamKeyEntity } from 'src/obs/entities/obs.entity';
@Module({
  imports: [TypeOrmModule.forFeature([LiveStreamingEntity, ObsStreamKeyEntity])],
  providers: [
    LiveStreamingService,
    {
      provide: 'ILiveStreamingRepository',
      useClass: LiveStreamingRepository,
    },
    ObsService,
    {
      provide: 'IObsStreamKeyRepository',
      useClass: ObsStreamKeyRepository,
    },
  ],
  controllers: [LiveStreamingController],
})
export class LiveStreamingModule {}
