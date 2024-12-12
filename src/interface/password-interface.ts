import { PasswordResetTokenEntity } from 'src/password/entities/password.reset.token.entity';

export interface IPasswordResetTokenRepository {
  saveToken(token: PasswordResetTokenEntity): Promise<PasswordResetTokenEntity>;
  findTokenByTokenHash(tokenHash: string): Promise<PasswordResetTokenEntity | null>;
  createToken(userId: number, tokenHash: string, expiresAt: Date): PasswordResetTokenEntity;
}
