export const mockChannelService = {
    createChannel: jest.fn(),
    getChannel: jest.fn(),
    updateChannel: jest.fn(),
    removeChannel: jest.fn(),
    findChannelByKeyword: jest.fn()
  };
  
  
  export const mockVideoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  
  export const mockChannelRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder : jest.fn()
  };

  
  export const mockResolutionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };


  