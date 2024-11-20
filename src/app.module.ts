import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChannelModule } from './channel/channel.module';
import { ChannelEntity } from './channel/entities/channel.entity';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entities/comment.entity';
import { LikeEntity } from './like/entities/like.entity';
import { LikeModule } from './like/like.module';
import { UploadModule } from './upload/upload.module';
import { UserEntity } from './user/entity/user.entity';
import { ResolutionsEntity } from './video/entities/resolutions.entity';
import { VideoEntity } from './video/entities/video.entity';
import { VideoModule } from './video/video.module';
import { ViewController } from './view/view.controller';
import { ViewModule } from './view/view.module';

const typeOrmModuleOptions = {
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'postgres',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [
      UserEntity,
      VideoEntity,
      ResolutionsEntity,
      ChannelEntity,
      CommentEntity,
      LikeEntity,
    ],
    synchronize: configService.get<boolean>('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
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
    UploadModule,
  ],
  controllers: [AppController, ViewController],
  providers: [AppService],
})
export class AppModule {}
