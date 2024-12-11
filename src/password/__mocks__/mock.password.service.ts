export const mockPasswordService = {
  resetPasswordRequest: jest.fn(),
  resetPassword: jest.fn(),
  updatePassword: jest.fn(),
};

export const mockTokenRepository = {
  saveToken: jest.fn(),
  findTokenByTokenHash: jest.fn(),
  createToken: jest.fn(),
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
  findUserByUserId: jest.fn(),
  deleteUser: jest.fn(),
  updateUser: jest.fn(),
};

export const mockMailerService = {
  sendMail: jest.fn(),
};

export const mockHashingService = {
  hash: jest.fn(),
};
