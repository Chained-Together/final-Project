import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';;
import { ChannelService } from './channel.service';
import { channelDto, mockUpdatedChannelDto } from './_mocks_/mock.channel.data'
import { ChannelEntity } from './entities/channel.entity';
import { mockUser } from './_mocks_/mock.channel.data';
import { mockChannel } from './_mocks_/mock.channel.data';
import { mockChannelRepository, mockChannelService } from './_mocks_/mock.channel.service'
describe('ChannelService', () => {
  let channelService: ChannelService;
 
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

 
  
 

  it('should be defined', () => {
    expect(channelService).toBeDefined();
  });

  describe('채널 생성 시 ', () => {
    it('채널명 중복 시 ConflictException를 반환한다.', async () => {
      mockChannelRepository.findOne.mockResolvedValue(mockChannel);
      await expect(channelService.createChannel(channelDto, mockUser)).rejects.toThrow(
        ConflictException,
      );
    });

    it('생성한 채널을 반환한다. ', async () => {
      mockChannelRepository.findOne.mockResolvedValue(null);
      mockChannelRepository.create.mockReturnValue(mockChannel);
      mockChannelRepository.save.mockResolvedValue(mockChannel);

      const result = await channelService.createChannel(channelDto, mockUser);

      expect(mockChannelRepository.findOne).toHaveBeenCalledWith({
        where: { name: channelDto.name },
      });
      expect(mockChannelRepository.create).toHaveBeenCalledWith({
        ...channelDto,
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

      await expect(channelService.updateChannel(mockUser, channelDto)).rejects.toThrow(
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
        where: { user: {id: mockUser.id} },
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
        where: {user:{id: mockUser.id} },
      });
      expect(mockChannelRepository.delete).toHaveBeenCalledWith({ id: mockChannel.id });
      expect(result).toEqual(mockChannel);
    });

    it('검색된 채널을 반환한다. ', async () => {
     
      const mockChannels = [
        { id: 1, name: 'Test Channel 1' },
        { id: 2, name: 'Test Channel 2' },
      ];
    
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockChannels),
      };
    
      // createQueryBuilder Mock 처리
      mockChannelRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
    
      // 서비스 메서드 호출
      const result = await channelService.findChannelByKeyword('Test');
    
      // Mock 함수 호출 여부 검증
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('channel.name LIKE :keyword', {
        keyword: '%Test%',
      });
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockChannels);
    
      // 호출 디버깅
      console.log(mockQueryBuilder.where.mock.calls);
      console.log(mockQueryBuilder.getMany.mock.calls);
    });
  });
});
