import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { BcryptHashingService } from 'src/interface/impl/bcrypt-hashing-service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'HashingService',
      useClass: BcryptHashingService,
    },
  ],
})
export class UserModule {}
