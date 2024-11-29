import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelDto } from './dto/channel.dto';
import { ChannelEntity } from './entities/channel.entity';

const mockChannelService = {
  createChannel: jest.fn(),
  getChannel: jest.fn(),
  updateChannel: jest.fn(),
  removeChannel: jest.fn(),
};

describe('ChannelController', () => {
  let controller: ChannelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChannelController],
      providers: [
        {
          provide: ChannelService,
          useValue: mockChannelService,
        },
      ],
    }).compile();

    controller = module.get<ChannelController>(ChannelController);
  });

  const user: UserEntity = {
    id: 1,
    email: 'test@test.com',
    password: 'testtest',
    name: 'test',
    nickname: 'test',
    phoneNumber: '010-4444-4444',
    likes: null,
    channel: null,
  };

  const channelDto: ChannelDto = {
    name: 'test',
    profileImage: 'image',
  };

  const mockChannel: ChannelEntity = {
    id: 1,
    name: 'test',
    userId: user.id,
    profileImage: 'image',
    video: null,
    user: user,
  };

  const updatedChannel: ChannelEntity = {
    ...mockChannel,
    ...channelDto,
  };

  // const mockResponse = {
  //   message: 'Channel deleted successfully',
  //   deletedChannel: mockChannel,
  // };

  describe('createChannel', () => {
    it('채널을 생성하고 반환한다.', async () => {
      mockChannelService.createChannel.mockResolvedValueOnce(mockChannel);

      //const result = await controller.createChannel(channelDto, user, res);
      //console.log(result);
      expect(mockChannelService.createChannel).toHaveBeenCalledWith(channelDto, user);
      //expect(result).toEqual(mockChannel);
    });

    describe('getChannel', () => {
      it('채널 정보를 반환한다.', async () => {
        mockChannelService.getChannel.mockResolvedValueOnce(mockChannel);

        const result = await controller.getChannel(1);

        expect(mockChannelService.getChannel).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockChannel);
      });
    });

    describe('updateChannel', () => {
      it('업데이트된 채널 정보를 반환한다. ', async () => {
        mockChannelService.updateChannel.mockResolvedValue(updatedChannel);
        const result = await controller.updateChannel(user, channelDto);
        expect(mockChannelService.updateChannel).toHaveBeenCalledWith(user, channelDto);
        expect(result).toEqual(updatedChannel);
      });
    });

    describe('deleteChannel', () => {
      it('삭제된 채널 정보를 반환한다. ', async () => {
        mockChannelService.removeChannel.mockResolvedValue(mockChannel);
        const result = await controller.removeChannel(user);

        expect(mockChannelService.removeChannel).toHaveBeenCalledWith(user);
        expect(result).toEqual(mockChannel);
      });
    });
  });
});
