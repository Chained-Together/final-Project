import { InjectRepository } from '@nestjs/typeorm';
import { IPasswordResetTokenRepository } from '../password-interface';
import { PasswordResetTokenEntity } from 'src/password/entities/password.reset.token.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(
    @InjectRepository(PasswordResetTokenEntity)
    private readonly repository: Repository<PasswordResetTokenEntity>,
  ) {}
  createToken(userId: number, tokenHash: string, expiresAt: Date): PasswordResetTokenEntity {
    return this.repository.create({
      userId: userId,
      tokenHash,
      expiresAt,
    });
  }
  saveToken(token: PasswordResetTokenEntity): Promise<PasswordResetTokenEntity> {
    return this.repository.save(token);
  }
  findTokenByTokenHash(tokenHash: string): Promise<PasswordResetTokenEntity | null> {
    return this.repository.findOne({
      where: { tokenHash },
    });
  }
}
