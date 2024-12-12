export const mockLikeService = {
  toggleLike: jest.fn(),
  getLikes: jest.fn(),
};
export const mockLikeRepository = {
  findLikeByUserIdAndVideoId: jest.fn(),
  saveLike: jest.fn(),
  deleteLike: jest.fn(),
  countLike: jest.fn(),
};

export const mockChannelRepository = {
  findChannelByVideoJoinUser: jest.fn(),
};

export const mockNotificationService = {
  emitNotification: jest.fn(),
};
