import { mockChannel } from "src/channel/_mocks_/mock.channel.data";
import { UserEntity } from "src/user/entities/user.entity";
import { PasswordResetTokenEntity } from "../entities/password.reset.token.entity";

export const mockUser : UserEntity = {
    id: 1,
    email: 'testuser@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    nickname: 'testnickname',
    phoneNumber: '010-1234-5678',
    isSocial: false,
    googleId: null,
    naverId: null,
    deletedAt: null,
    likes: [],
    channel: mockChannel,
  };
  
  export const mockPasswordResetToken: PasswordResetTokenEntity = {
    id: 1,
    tokenHash: 'hashed-token',
    userId: mockUser.id,
    expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour later
    used: false,
    createdAt:new Date()
  };
  
  export const mockUsedToken: PasswordResetTokenEntity = {
    ...mockPasswordResetToken,
    used: true,
  };
  
  export const mockResetPasswordRequestDto = {
    email: mockUser.email,
  };
  
  export const mockUpdatePasswordDto = {
    newPassword: 'newPassword123',
  };
  
  export const mockUpdatedUser = {
    ...mockUser,
    password: 'hashedNewPassword123',
  };
  export const mockExpiredToken: PasswordResetTokenEntity = {
    ...mockPasswordResetToken,
    expiresAt: new Date(Date.now() - 1000), // Already expired
  };