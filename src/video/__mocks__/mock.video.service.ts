import { mockVideos } from 'src/channel/_mocks_/mock.channel.data';

export const mockVideoService = {
  saveMetadata: jest.fn(),
  getAllVideo: jest.fn(),
  getVideo: jest.fn(),
  updateVideo: jest.fn(),
  deleteVideo: jest.fn(),
  getVideoLink: jest.fn(),
  getNewVideos: jest.fn(),
  getAllVideoOfMyChannel: jest.fn(),
  getAllVideoOfChannel: jest.fn(),
  findVideoByKeyword: jest.fn(),
};

export const mockVideoRepository = {
  findVideoByVideoCode: jest.fn(),
  findAllVideo: jest.fn(),
  findAllVideoByChannelAndVisibility: jest.fn(),
  findAllVideoByChannelId: jest.fn(),
  findVideoWithChannelAndResolution: jest.fn(),
  updateVideo: jest.fn(),
  deleteVideo: jest.fn(),
  findByKeyword: jest.fn(),
  findNewVideos: jest.fn(),
  createVideo: jest.fn(),
  saveVideo: jest.fn(),
  findVideoByVideoId: jest.fn(),
};

export const mockChannelRepository = {
  createQueryBuilder: jest.fn(),
  findChannelByUserId: jest.fn(),
  findChannelByChannelId: jest.fn(),
  findChannelByName: jest.fn(),
  createChannel: jest.fn(),
  updateChannel: jest.fn(),
  deleteChannel: jest.fn(),
  findChannelByKeyword: jest.fn(),
  save: jest.fn(),
};

export const mockResolutionRepository = {
  findResolutionByVideoId: jest.fn(),
  updateResolution: jest.fn(),
  createResolution: jest.fn(),
  saveResolution: jest.fn(),
};

export const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(mockVideos),
};
