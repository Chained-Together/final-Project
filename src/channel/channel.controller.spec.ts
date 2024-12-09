import { Test, TestingModule } from '@nestjs/testing';
import { channelDto, mockChannel, mockUser } from './_mocks_/mock.channel.data';
import { mockChannelService } from './_mocks_/mock.channel.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { ChannelEntity } from './entities/channel.entity';

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

  const updatedChannel: ChannelEntity = {
    ...mockChannel,
    ...channelDto,
  };

  // describe('createChannel', () => {
  //   it('채널을 생성하고 /main으로 리다이렉트한다.', async () => {

  //     mockChannelService.createChannel.mockResolvedValueOnce(mockChannel);

  //     await controller.createChannel(channelDto, mockUser, mockResponse);

  //     expect(mockChannelService.createChannel).toHaveBeenCalledWith(channelDto, mockUser);
  //     expect(mockResponse.redirect).toHaveBeenCalledWith('/main');
  //   });

  //TODO: mockResponse부분 수정
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
      const result = await controller.updateChannel(mockUser, channelDto);
      expect(mockChannelService.updateChannel).toHaveBeenCalledWith(mockUser, channelDto);
      expect(result).toEqual(updatedChannel);
    });
  });

  describe('deleteChannel', () => {
    it('삭제된 채널 정보를 반환한다. ', async () => {
      mockChannelService.removeChannel.mockResolvedValue(mockChannel);
      const result = await controller.removeChannel(mockUser);

      expect(mockChannelService.removeChannel).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('findChannelByKeyword', () => {
    it('검색된 채널정보를 반환한다. ', async () => {
      const mockKeword = 'testTV';
      mockChannelService.findChannelByKeyword.mockResolvedValue(mockChannel);
      const result = await controller.findChannelByKeyword(mockKeword);

      expect(mockChannelService.findChannelByKeyword).toHaveBeenCalledWith(mockKeword);
      expect(result).toEqual(mockChannel);
    });
  });
});
