export const mockUserRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockHashingService = {
  hash: jest.fn(),
  compare: jest.fn(),
};
