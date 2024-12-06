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
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => mockQueryBuilder),
};

export const mockChannelRepository = {
  findOne: jest.fn(),
};

export const mockResolutionRepository = {
  create: jest.fn(),
  save: jest.fn(),
};

export const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]),
};

export const getRepository = jest.fn(() => mockVideoRepository);
export const Repository = jest.fn(() => mockVideoRepository);
