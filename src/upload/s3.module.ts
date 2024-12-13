import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';

@Module({
  providers: [
    S3Service,
    {
      provide: 'S3_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get('AWS_REGION'),
          credentials: {
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID')!,
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY')!,
          },
        });
      },
    },
  ],
  controllers: [S3Controller],
})
export class S3Module {}
