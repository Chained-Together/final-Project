export const mockNotificationService = {
  getNotificationStream: jest.fn(),
  updateNotification: jest.fn(),
  getPastNotifications: jest.fn(),
};

export const mockChannelRepository = {
  findOne: jest.fn(),
};

export const mockNotificationRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
};

export const mockEventEmitter = {
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
};
