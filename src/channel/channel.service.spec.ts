import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IChannelRepository } from 'src/interface/channel-interface';
import {
  channelDto,
  mockChannel,
  mockChannels,
  mockCreateChannel,
  mockUpdatedChannel,
  mockUpdatedChannelDto,
  mockUser,
} from './_mocks_/mock.channel.data';
import { mockChannelRepository } from './_mocks_/mock.channel.service';
import { ChannelService } from './channel.service';

describe('ChannelService', () => {
  let channelService: ChannelService;
  let channelRepository: IChannelRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: 'IChannelRepository',
          useValue: mockChannelRepository,
        },
      ],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
    channelRepository = module.get<IChannelRepository>('IChannelRepository');
  });

  it('should be defined', () => {
    expect(channelService).toBeDefined();
  });

  describe('채널 생성 시 ', () => {
    it('채널명 중복 시 ConflictException를 반환한다.', async () => {
      mockChannelRepository.findChannelByName.mockResolvedValue(mockChannel);
      await expect(channelService.createChannel(channelDto, mockUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('채널을 성공적으로 생성한다.. ', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(null);
      mockChannelRepository.findChannelByName.mockResolvedValue(null);
      mockChannelRepository.createChannel.mockReturnValue(mockCreateChannel);
      mockChannelRepository.save.mockResolvedValue(mockCreateChannel);

      const result = await channelService.createChannel(channelDto, mockUser);

      expect(mockChannelRepository.findChannelByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(mockChannelRepository.findChannelByName).toHaveBeenCalledWith(channelDto.name);
      expect(mockChannelRepository.createChannel).toHaveBeenCalledWith(
        channelDto.name,
        channelDto.profileImage,
        mockUser,
      );
      expect(mockChannelRepository.save).toHaveBeenCalledWith(mockCreateChannel);
      expect(result).toEqual(mockCreateChannel);
    });
  });

  describe('채널 조회 시 ', () => {
    it('채널이 존재 하지 않을 시 NotfoundException을 던진다.', async () => {
      mockChannelRepository.findChannelByChannelId.mockResolvedValue(null);

      await expect(channelService.getChannel(1)).rejects.toThrow(NotFoundException);
    });

    it('채널 정보를 반환한다. ', async () => {
      mockChannelRepository.findChannelByChannelId.mockResolvedValue(mockChannel);
      const result = await channelService.getChannel(1);

      expect(mockChannelRepository.findChannelByChannelId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('내 채널 조회 시 ', () => {
    it('채널이 존재 하지 않을 시 NotFoundException을 던진다', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(null);

      await expect(channelService.getMyChannel(mockUser)).rejects.toThrow(NotFoundException);
    });

    it('내 채널 정보를 반환한다. ', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);

      const result = await channelService.getMyChannel(mockUser);

      expect(mockChannelRepository.findChannelByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('채널 업데이트 시 ', () => {
    it('채널이 존재 하지 않을 시 NotfoundException을 반환한다.', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(null);

      await expect(channelService.updateChannel(mockUser, channelDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('업데이트된 채널 정보를 반환한다.', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);
      mockChannelRepository.updateChannel.mockResolvedValue(undefined);
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockUpdatedChannel);

      const result = await channelService.updateChannel(mockUser, mockUpdatedChannelDto);

      expect(mockChannelRepository.findChannelByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(mockChannelRepository.updateChannel).toHaveBeenCalledWith(
        mockChannel.id,
        mockUpdatedChannelDto.name,
        mockUpdatedChannelDto.profileImage,
      );
      expect(result.name).toEqual(mockUpdatedChannel.name);
      expect(result.profileImage).toEqual(mockUpdatedChannel.profileImage);
    });
  });

  describe('채널 삭제 시 ', () => {
    it('채널이 존재 하지 않을 시 NotfoundException을 반환한다.', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(null);

      await expect(channelService.removeChannel(mockUser)).rejects.toThrow(NotFoundException);
    });

    it('삭제된 채널 정보를 반환한다. ', async () => {
      mockChannelRepository.findChannelByUserId.mockResolvedValue(mockChannel);
      mockChannelRepository.deleteChannel.mockResolvedValue(undefined);

      const result = await channelService.removeChannel(mockUser);

      expect(mockChannelRepository.findChannelByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(mockChannelRepository.deleteChannel).toHaveBeenCalledWith(mockChannel.id);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('채널 검색 시', () => {
    it('검색된 채널들을 반환한다. ', async () => {
      mockChannelRepository.findChannelByKeyword.mockResolvedValue(mockChannels);

      const result = await channelService.findChannelByKeyword('Test');

      expect(mockChannelRepository.findChannelByKeyword).toHaveBeenCalledWith('Test');
      expect(result).toEqual(mockChannels);
    });
  });
});
