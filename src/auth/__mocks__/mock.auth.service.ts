import { sign } from 'crypto';

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

export const mockAuthService = {
  signUp: jest.fn(),
  logIn: jest.fn(),
};

export const mockChannelService = {
  createChannel: jest.fn(),
};
