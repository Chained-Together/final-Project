import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelEntity } from './entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { channelRepository } from 'src/interface/impl/channel.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity])],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    {
      provide: 'IChannelRepository',
      useClass: channelRepository,
    },
  ],
})
export class ChannelModule {}
