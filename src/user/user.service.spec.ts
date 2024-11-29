import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { mockUserRepository, mockHashingService } from './__mocks__/mock.user.service';
import {
  mockUserEntity,
  mockCreateUserDto,
  mockInvalidCreateUserDto,
  mockDeleteUserDto,
} from './__mocks__/mock.user.data';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: 'HashingService',
          useValue: mockHashingService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // 테스트 이후 모든 모킹 상태 초기화
  });

  describe('findEmail', () => {
    it('사용자를 찾아 이메일을 반환해야 합니다.', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(mockUserEntity);

      const result = await userService.findEmail(mockCreateUserDto);

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual({ email: mockUserEntity.email });
    });

    it('존재하지 않는 사용자에 대해 NotFoundException을 던져야 합니다.', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(userService.findEmail(mockInvalidCreateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith(mockInvalidCreateUserDto);
    });
  });

  describe('deleteUserAccount', () => {
    it('유효한 정보로 계정을 삭제하고 성공 메시지를 반환해야 합니다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUserEntity);
      mockUserRepository.softDelete.mockResolvedValue(undefined);
      mockHashingService.compare.mockResolvedValue(true);

      const result = await userService.deleteUserAccount(mockUserEntity, mockDeleteUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockDeleteUserDto.email },
      });
      expect(mockHashingService.compare).toHaveBeenCalledWith(
        mockDeleteUserDto.password,
        mockUserEntity.password,
      );
      expect(mockUserRepository.softDelete).toHaveBeenCalledWith({ id: mockUserEntity.id });
      expect(result).toEqual({ message: '회원탈퇴 성공' });
    });

    it('잘못된 이메일로 삭제 요청 시 NotFoundException을 던져야 합니다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        userService.deleteUserAccount(mockUserEntity, mockDeleteUserDto),
      ).rejects.toThrow(NotFoundException);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockDeleteUserDto.email },
      });
      expect(mockHashingService.compare).not.toHaveBeenCalled();
    });

    it('잘못된 비밀번호로 삭제 요청 시 UnauthorizedException을 던져야 합니다.', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUserEntity);
      mockHashingService.compare.mockResolvedValue(false);

      await expect(
        userService.deleteUserAccount(mockUserEntity, mockDeleteUserDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
