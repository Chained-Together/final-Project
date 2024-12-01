export const mockPasswordService = {
    resetPasswordRequest: jest.fn(),
    resetPassword: jest.fn(),
    updatePassword: jest.fn(),
  };
  
  export const mockTokenRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  export const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  export const mockMailerService = {
    sendMail: jest.fn(),
  };

  export const mockHashingService = {
    hash: jest.fn(),
  };