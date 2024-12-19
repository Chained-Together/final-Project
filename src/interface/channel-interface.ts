import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

export interface IChannelRepository {
  findChannelByUserId(userId: number): Promise<ChannelEntity | null>;
  findChannelByName(name: string): Promise<ChannelEntity | null>;
  findChannelByChannelId(channelId: number): Promise<ChannelEntity | null>;
  createChannel(name: string, profileImage: string, user: UserEntity): ChannelEntity;
  updateChannel(channelId: number, name?: string, profileImage?: string): Promise<UpdateResult>;
  deleteChannel(channelId: number): Promise<DeleteResult>;
  findChannelByKeyword(keyword: string): Promise<ChannelEntity[]>;
  save(channel: ChannelEntity): Promise<ChannelEntity>;
  findChannelByVideoJoinUser(videoId: number): Promise<ChannelEntity>;
  findChannelByVideoId(videoId: number): Promise<ChannelEntity>;
}
