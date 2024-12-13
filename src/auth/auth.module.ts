import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelEntity } from 'src/channel/entities/channel.entity';
import { BcryptHashingService } from 'src/interface/impl/bcrypt-hashing-service';
import { ChannelRepository } from 'src/interface/impl/channel.repository';
import { UserRepository } from 'src/interface/impl/user.repository';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { NaverStrategy } from './naver.strategy';

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
    {
      provide: 'IChannelRepository',
      useClass: ChannelRepository,
    },
  ],
})
export class AuthModule {}
