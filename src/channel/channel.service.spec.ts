import { Test, TestingModule } from '@nestjs/testing';
import { ChannelService } from './channel.service';
import { ChannelEntity } from './entities/channel.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChannelDto } from './dto/channel.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('ChannelService', () => {
  let channelService: ChannelService;
  const mockChannelRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        {
          provide: getRepositoryToken(ChannelEntity),
          useValue: mockChannelRepository,
        },
      ],
    }).compile();

    channelService = module.get<ChannelService>(ChannelService);
  });

  const mockUser: UserEntity = {
    id: 1,
    email: 'test@test.com',
    password: 'testtest',
    name: 'test',
    nickname: 'test',
    phoneNumber: '010-4444-4444',
    likes: null,
    channel: null,
  };

  const mockChannelDto: ChannelDto = {
    name: 'test',
    profileImage: 'image',
  };

  const mockChannel: ChannelEntity = {
    id: 1,
    name: 'test',
    profileImage: 'image',
    userId: 1,
    video: null,
    user: mockUser,
  };

  const mockUpdatedChannelDto: ChannelDto = {
    name: 'test1',
    profileImage: 'image',
  };

  const mockUpdatedChannel: ChannelEntity = {
    id: 1,
    name: 'test1',
    profileImage: 'image',
    userId: 1,
    video: null,
    user: mockUser,
  };

  it('should be defined', () => {
    expect(channelService).toBeDefined();
  });

  describe('채널 생성 시 ', () => {
    it('채널명 중복 시 ConflictException를 반환한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      await expect(channelService.createChannel(mockChannelDto, mockUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('생성한 채널을 반환한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);
      mockChannelRepository.create.mockReturnValue(mockChannel);
      mockChannelRepository.save.mockResolvedValue(mockChannel);

      const result = await channelService.createChannel(mockChannelDto, mockUser);

      expect(mockChannelRepository.findOne).toHaveBeenCalledWith({
        where: { name: mockChannelDto.name },
      });
      expect(mockChannelRepository.create).toHaveBeenCalledWith({
        ...mockChannelDto,
        userId: mockUser.id,
      });
      expect(mockChannelRepository.save).toHaveBeenCalledWith(mockChannel);
      expect(result).toEqual(mockChannel);
    });
  });

  describe('채널 상세 조회 시 ', () => {
    it('채널이 존재 하지 않을 시 NotfoundException을 반환한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(channelService.getChannel(1)).rejects.toThrow(NotFoundException);
    });

    it('채널 정보를 반환한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      const result = await channelService.getChannel(1);

      expect(mockChannelRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockChannel);
    });
  });

  describe('채널 업데이트 시 ', () => {
    it('채널이 존재 하지 않을 시 NotfoundException을 반환한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(channelService.updateChannel(mockUser, mockChannelDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('업데이트된 채널 정보를 반환한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockChannelRepository.update.mockResolvedValue(undefined);

      const updatedChannel: ChannelEntity = {
        ...mockChannel,
        ...mockUpdatedChannelDto,
      };
      mockChannelRepository.findOne.mockResolvedValue(updatedChannel);
      const result = await channelService.updateChannel(mockUser, mockUpdatedChannelDto);
      expect(mockChannelRepository.findOne).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
      expect(mockChannelRepository.update).toHaveBeenCalledWith(
        { id: mockChannel.id },
        {
          name: mockUpdatedChannelDto.name,
          profileImage: mockUpdatedChannelDto.profileImage,
        },
      );
      expect(result).toEqual(updatedChannel);
    });
  });

  describe('채널 삭제 시 ', () => {
    it('채널이 존재 하지 않을 시 NotfoundException을 반환한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);

      await expect(channelService.removeChannel(mockUser)).rejects.toThrow(NotFoundException);
    });

    it('삭제된 채널 정보를 반환한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      mockChannelRepository.delete.mockResolvedValue(undefined);

      const result = await channelService.removeChannel(mockUser);

      expect(mockChannelRepository.findOne).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
      expect(mockChannelRepository.delete).toHaveBeenCalledWith({ id: mockChannel.id });
      expect(result).toEqual(mockChannel);
    });
  });
});
