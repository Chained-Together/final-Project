export const mockUserService = {
  findEmail: jest.fn(),
};
export const mockUserRepository = {
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
};

export const mockHashingService = {
  compare: jest.fn(),
};
