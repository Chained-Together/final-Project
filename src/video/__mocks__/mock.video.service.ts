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
};

export const mockVideoRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockChannelRepository = {
  findOne: jest.fn(),
};

export const mockResolutionRepository = {
  create: jest.fn(),
  save: jest.fn(),
};
