export const mockUserService = {
  findEmail: jest.fn(),
};

export const mockUserRepository = {
  findByEmail: jest.fn(),
  findByNickname: jest.fn(),
  findByPhoneNumber: jest.fn(),
  findByGoogleId: jest.fn(),
  findByNaverId: jest.fn(),
  createByGoogleId: jest.fn(),
  createByNaverId: jest.fn(),
  save: jest.fn(),
  updateUser: jest.fn(),
  findUserByUserId: jest.fn(),
  deleteUser: jest.fn(),
  findUserByNameAndPhoneNumber: jest.fn(),
};
export const mockHashingService = {
  compare: jest.fn(),
  hash: jest.fn(),
};

export const mockTokenRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

export const mockMailerService = {
  sendMail: jest.fn(),
};
