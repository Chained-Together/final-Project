export const mockUserRepository = {
  findByEmail: jest.fn(),
  findByNickname: jest.fn(),
  findByPhoneNumber: jest.fn(),
  findByGoogleId: jest.fn(),
  findByNaverId: jest.fn(),
  createByGoogleId: jest.fn(),
  createByNaverId: jest.fn(),
  save: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockHashingService = {
  hash: jest.fn(),
  compare: jest.fn(),
};

export const mockAuthService = {
  signUp: jest.fn(),
  logIn: jest.fn(),
};

export const mockChannelService = {
  createChannel: jest.fn(),
};
