export const mockLikeService = {
    toggleLike: jest.fn(), 
    getLikes: jest.fn(),
  };
 export const mockLikeRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

export const mockChannelRepository = {
    findOne: jest.fn(), // 채널 찾기
  };
  
  export const mockNotificationService = {
    emitNotification: jest.fn(), // 알림 발송
  };