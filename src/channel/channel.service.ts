import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IChannelRepository } from 'src/interface/channel-interface';
import { UserEntity } from '../../src/user/entities/user.entity';
import { ChannelDto } from './dto/channel.dto';
import { ChannelEntity } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @Inject('IChannelRepository')
    private readonly channelRepository: IChannelRepository,
  ) {}

  async createChannel(channelDto: ChannelDto, user: UserEntity): Promise<ChannelEntity> {
    await this.ensureUserHasNoChannel(user.id);
    await this.ensureChannelNameIsUnique(channelDto.name);

    const createChannel = this.channelRepository.createChannel(
      channelDto.name,
      channelDto.profileImage,
      user,
    );

    await this.channelRepository.save(createChannel);

    return createChannel;
  }

  async getChannel(id: number): Promise<ChannelEntity> {
    return this.findChannelByIdOrThrow(id);
  }

  async getMyChannel(user: UserEntity): Promise<ChannelEntity> {
    return this.findChannelByUserIdOrThrow(user.id);
  }

  async updateChannel(user: UserEntity, channelDto: ChannelDto): Promise<ChannelEntity> {
    const foundChannel = await this.findChannelByUserIdOrThrow(user.id);
    await this.ensureChannelNameIsUnique(channelDto.name);

    await this.channelRepository.updateChannel(
      foundChannel.id,
      channelDto.name,
      channelDto.profileImage,
    );
    return this.findChannelByUserIdOrThrow(user.id);
  }

  async removeChannel(user: UserEntity): Promise<ChannelEntity> {
    const foundChannelById = await this.findChannelByUserIdOrThrow(user.id);

    await this.channelRepository.deleteChannel(foundChannelById.id);
    return foundChannelById;
  }

  async findChannelByKeyword(keyword: string): Promise<ChannelEntity[]> {
    this.validateKeyword(keyword);
    return this.channelRepository.findChannelByKeyword(keyword);
  }

  private async findChannelByUserIdOrThrow(userId: number): Promise<ChannelEntity> {
    const foundChannel = await this.channelRepository.findChannelByUserId(userId);
    if (!foundChannel) {
      throw new NotFoundException('해당 채널이 존재하지 않습니다.');
    }
    return foundChannel;
  }
  private async ensureUserHasNoChannel(userId: number): Promise<void> {
    const isExistChannel = await this.channelRepository.findChannelByUserId(userId);
    if (isExistChannel) {
      throw new ConflictException(`이미 채널을 보유 중 입니다. (${isExistChannel.name})`);
    }
  }
  private async ensureChannelNameIsUnique(name: string): Promise<void> {
    const found = await this.channelRepository.findChannelByName(name);

    if (found) {
      throw new ConflictException(`입력하신 채널이름(${name})이 이미 존재합니다.`);
    }
  }

  private async findChannelByIdOrThrow(channelId: number): Promise<ChannelEntity> {
    const foundChannel = await this.channelRepository.findChannelByChannelId(channelId);
    if (!foundChannel) {
      throw new NotFoundException('해당 채널이 존재하지 않습니다.');
    }
    return foundChannel;
  }
  private async validateKeyword(keyword: string): Promise<void> {
    if (!keyword || keyword.trim().length === 0) {
      throw new BadRequestException('Keyword cannot be empty');
    }
  }
}
