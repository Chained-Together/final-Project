import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { LambdaService } from 'src/lambda/lambda.service';
import { VideoEntity } from './entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, ChannelEntity])],
  controllers: [VideoController],
  providers: [
    VideoService,
    {
      provide: 'LambdaService',
      useClass: LambdaService,
    },
    LambdaService,
  ],
})
export class VideoModule {}
