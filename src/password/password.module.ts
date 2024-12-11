import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetTokenRepository } from 'src/interface/impl/password-token.repository';
import { UserRepository } from 'src/interface/impl/user.repository';
import { NodemailerService } from '../auth/nodemailer/nodemailer.service';
import { BcryptHashingService } from '../interface/impl/bcrypt-hashing-service';
import { UserEntity } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { PasswordResetTokenEntity } from './entities/password.reset.token.entity';
import { PasswordController } from './password.controller';
import { PasswordService } from './password.service';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetTokenEntity, UserEntity]), UserModule],
  controllers: [PasswordController],
  providers: [
    PasswordService,
    NodemailerService,
    {
      provide: 'IPasswordResetTokenRepository',
      useClass: PasswordResetTokenRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'HashingService',
      useClass: BcryptHashingService,
    },
  ],
})
export class PasswordModule {}
