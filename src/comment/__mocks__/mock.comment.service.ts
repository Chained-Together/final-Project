export const mockCommentService = {
  createComment: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateComment: jest.fn(),
  removeComment: jest.fn(),
  createReply: jest.fn(),
};

export const mockCommentRepository = {
  createComment: jest.fn(),
  save: jest.fn(),
  findCommentByVideoId: jest.fn(),
  findCommentByVideoIdAndDepth: jest.fn(),
  findCommentByCommentId: jest.fn(),
  findAllComment: jest.fn(),
  findAllReplyComment: jest.fn(),
  findCommentUserIdAndCommentIdAndVideoId: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
  findReplyByCommentGroup: jest.fn(),
  createReply: jest.fn(),
  findCommentByUserId: jest.fn(),
};

export const mockVideoRepository = {
  findVideoByVideoId: jest.fn(),
};

export const mockNotificationService = {
  emitNotification: jest.fn(),
};
