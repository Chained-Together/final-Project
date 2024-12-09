import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { IChannelRepository } from '../channel-interface';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from 'src/channel/entities/channel.entity';

export class channelRepository implements IChannelRepository {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly repository: Repository<ChannelEntity>,
  ) {}
  findChannelByVideoJoinUser(videoId: number): Promise<ChannelEntity> {
    return this.repository.findOne({
      where: { video: { id: videoId } },
      relations: ['user'],
    });
  }
  save(channel: ChannelEntity): Promise<ChannelEntity> {
    return this.repository.save(channel);
  }

  findChannelByUserId(userId: number): Promise<ChannelEntity | null> {
    return this.repository.findOne({ where: { user: { id: userId } } });
  }
  findChannelByName(name: string): Promise<ChannelEntity | null> {
    return this.repository.findOne({ where: { name } });
  }
  findChannelByChannelId(channelId: number): Promise<ChannelEntity | null> {
    return this.repository.findOne({ where: { id: channelId } });
  }
  createChannel(name: string, profileImage: string, user: UserEntity): ChannelEntity {
    return this.repository.create({ name, profileImage, user });
  }
  updateChannel(channelId: number, name?: string, profileImage?: string): Promise<UpdateResult> {
    return this.repository.update(
      { id: channelId },
      {
        name,
        profileImage,
      },
    );
  }
  deleteChannel(channelId: number): Promise<DeleteResult> {
    return this.repository.delete({ id: channelId });
  }
  findChannelByKeyword(keyword: string): Promise<ChannelEntity[]> {
    return this.repository
      .createQueryBuilder('channel')
      .where('channel.name LIKE :keyword', { keyword: `%${keyword}%` })
      .getMany();
  }
}
