import { mockChannels } from './mock.channel.data';

export const mockChannelService = {
  createChannel: jest.fn(),
  getChannel: jest.fn(),
  updateChannel: jest.fn(),
  removeChannel: jest.fn(),
  findChannelByKeyword: jest.fn(),
  findOne: jest.fn(),
};
export const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(mockChannels),
};

export const mockChannelRepository = {
  createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  findChannelByUserId: jest.fn(),
  findChannelByChannelId: jest.fn(),
  findChannelByName: jest.fn(),
  createChannel: jest.fn(),
  updateChannel: jest.fn(),
  deleteChannel: jest.fn(),
  findChannelByKeyword: jest.fn(),
  save: jest.fn(),
};
