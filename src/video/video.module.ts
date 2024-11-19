import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VideoEntity } from './entities/video.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoEntity, ChannelEntity])],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
