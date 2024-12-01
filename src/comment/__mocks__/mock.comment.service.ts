export const mockCommentService = {
  createComment: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateComment: jest.fn(),
  removeComment: jest.fn(),
  createReply: jest.fn(),
};

export const mockCommentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findOneBy: jest.fn(),
};

export const mockVideoRepository = {
  find: jest.fn(),
};
