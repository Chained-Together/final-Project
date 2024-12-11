export const mockNotificationService = {
  getNotificationStream: jest.fn(),
  updateNotification: jest.fn(),
  getPastNotifications: jest.fn(),
};

export const mockChannelRepository = {
  findChannelByUserId: jest.fn(),
  findChannelByChannelId: jest.fn(),
  findChannelByName: jest.fn(),
  createChannel: jest.fn(),
  updateChannel: jest.fn(),
  deleteChannel: jest.fn(),
  findChannelByKeyword: jest.fn(),
  save: jest.fn(),
  findChannelByVideoJoinUser: jest.fn(),
};

export const mockNotificationRepository = {
  createNotification: jest.fn(),
  saveNotification: jest.fn(),
  findAllNotificationByUserId: jest.fn(),
  updateNotification: jest.fn(),
};

export const mockEventEmitter = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
};
