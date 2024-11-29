import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  mockCreateUserDto,
  mockErrorMessage,
  mockInvalidCreateUserDto,
  mockUserResponse,
} from './__mocks__/mock.user.data';
import { mockUserService } from './__mocks__/mock.user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  describe('findEmail', () => {
    it('서비스의 findEmail 메서드를 호출하고 createUserDto를 반환해야 합니다.', async () => {
      mockUserService.findEmail.mockResolvedValue(mockUserResponse);

      const result = await userController.findEmail(mockCreateUserDto);

      expect(userService.findEmail).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUserResponse);
    });
    //예외처리
    it('서비스에서 예외를 던지면 컨트롤러도 동일한 예외를 던져야 합니다', async () => {
      mockUserService.findEmail.mockRejectedValue(new Error(mockErrorMessage));

      await expect(userController.findEmail(mockInvalidCreateUserDto)).rejects.toThrowError(
        mockErrorMessage,
      );
      expect(userService.findEmail).toHaveBeenCalledWith(mockInvalidCreateUserDto);
    });
  });
});
