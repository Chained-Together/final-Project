import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { NodemailerModule } from './auth/nodemailer/nodemailer.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelEntity } from './channel/entities/channel.entity';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entities/comment.entity';
import { LikeEntity } from './like/entities/like.entity';
import { LikeModule } from './like/like.module';
import { NotificationEntity } from './notification/entities/notification.entity';
import { NotificationModule } from './notification/notification.module';
import { PasswordResetTokenEntity } from './password/entities/password.reset.token.entity';
import { PasswordModule } from './password/password.module';
import { ResolutionEntity } from './resolution/entities/resolution.entity';
import { ResolutionModule } from './resolution/resolution.module';
import { S3Module } from './upload/s3.module';
import { UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { VideoEntity } from './video/entities/video.entity';
import { VideoModule } from './video/video.module';
import { ViewController } from './view/view.controller';
import { ViewModule } from './view/view.module';
import { ObsModule } from './obs/obs.module';
import { ObsStreamKeyEntity } from './obs/entities/obs.entity';
import { LiveStreamingEntity } from './liveStreaming/entities/liveStreaming.entity';
import { LiveStreamingModule } from './liveStreaming/liveStreaming.module';
import { ChatModule } from './chat/chat.module';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'postgres',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    ssl: {
      rejectUnauthorized: false,
    },
    database: configService.get('DB_NAME'),
    entities: [
      UserEntity,
      VideoEntity,
      ResolutionEntity,
      ChannelEntity,
      CommentEntity,
      LikeEntity,
      PasswordResetTokenEntity,
      NotificationEntity,
      ObsStreamKeyEntity,
      LiveStreamingEntity,
    ],
    synchronize: configService.get<boolean>('DB_SYNC'),
    logging: ['query', 'error', 'schema', 'warn', 'info'],
    maxQueryExecutionTime: 150,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    AuthModule,
    VideoModule,
    CommentModule,
    ChannelModule,
    LikeModule,
    ViewModule,
    S3Module,
    ResolutionModule,
    UserModule,
    NodemailerModule,
    PasswordModule,
    NotificationModule,
    EventEmitterModule.forRoot(),
    ObsModule,
    LiveStreamingModule,
    ChatModule,
  ],
  controllers: [AppController, ViewController],
  providers: [
    AppService,
    {
      provide: 'LOGGER',
      useFactory: (configService: ConfigService) => {
        return new Logger(AppModule.name);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
