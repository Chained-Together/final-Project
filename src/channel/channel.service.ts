import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ChannelEntity } from './entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelDto } from './dto/channel.dto';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
  ) {}

  /**채널 생성 */
  async createChannel(channelDto: ChannelDto, user: User): Promise<ChannelEntity> {
    const { name, profileImage } = channelDto;

    //채널명 중복확인
    const found = await this.findChannel({ name });
    if (found) {
      throw new ConflictException(`입력하신 채널이름(${name})이 이미 존재합니다.`);
    }

    const createChannel = this.channelRepository.create({
      name,
      profileImage,
      userId: user.id,
    });

    await this.channelRepository.save(createChannel);

    return createChannel;
  }

  /**채널 상세 조회 */
  async getChannel(id: number): Promise<ChannelEntity> {
    const foundChannel = await this.findChannel({ id });
    if (!foundChannel) {
      throw new NotFoundException('해당 채널이 존재하지 않습니다.');
    }

    return foundChannel;
  }

  /**채널 수정*/
  async updateChannel(user: User, channelDto: ChannelDto): Promise<ChannelEntity> {
    const foundChannel = await this.findChannel({ userId: user.id });
    if (!foundChannel) {
      throw new NotFoundException('해당 채널이 존재하지 않습니다.');
    }

    const updateChannel = await this.channelRepository.update(
      { id: foundChannel.id },
      {
        name: channelDto.name,
        profileImage: channelDto.profileImage,
      },
    );

    const foundUpdatedChannel = await this.findChannel({ userId: user.id });
    return foundUpdatedChannel;
  }

  /**채널 삭제*/
  async removeChannel(user: User): Promise<ChannelEntity> {
    const foundChannelById = await this.findChannel({ userId: user.id });
    if (!foundChannelById) {
      throw new NotFoundException('해당 채널이 존재하지 않습니다.');
    }

    const channelId = foundChannelById.id;

    //채널삭제
    await this.channelRepository.delete({ id: channelId });
    return foundChannelById;
  }

  private async findChannel(condition) {
    const foundChannel = await this.channelRepository.findOne({ where: condition });
    return foundChannel;
  }
}
