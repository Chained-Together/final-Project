export const mockResolutionRepository = {
  findResolutionByvideoId: jest.fn(),
  updateResolution: jest.fn(),
  createResolution: jest.fn(),
  saveResolution: jest.fn(),
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

export const mockResolutionService = {
  updateResolution: jest.fn(),
};
