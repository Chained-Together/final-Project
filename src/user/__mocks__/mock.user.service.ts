export const mockUserService = {
  findEmail: jest.fn(),
};
export const mockUserRepository = {
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  save: jest.fn(),
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


