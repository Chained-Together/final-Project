import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptHashingService } from 'src/interface/impl/bcrypt-hashing-service';
import { UserRepository } from 'src/interface/impl/user.repository';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
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
export class UserModule {}
