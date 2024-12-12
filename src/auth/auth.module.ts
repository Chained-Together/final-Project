import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './jwt.strategy';
import { BcryptHashingService } from 'src/interface/impl/bcrypt-hashing-service';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { GoogleStrategy } from './google.strategy';
import { NaverStrategy } from './naver.strategy';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelModule } from 'src/channel/channel.module';
import { UserRepository } from 'src/interface/impl/user.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserEntity, ChannelEntity]),
    ChannelModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    NaverStrategy,
    ChannelService,
    {
      provide: 'HashingService',
      useClass: BcryptHashingService,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
