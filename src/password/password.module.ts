import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetTokenEntity } from './entities/password.reset.token.entity';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { UserModule } from '../user/user.module';
import { NodemailerService } from '../auth/nodemailer/nodemailer.service';
import { BcryptHashingService } from '../interface/impl/bcrypt-hashing-service';
import { UserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PasswordResetTokenEntity, UserEntity]), UserModule],
  controllers: [PasswordController],
  providers: [
    PasswordService,
    NodemailerService,
    {
      provide: 'HashingService',
      useClass: BcryptHashingService,
    },
  ],
})
export class PasswordModule {}
