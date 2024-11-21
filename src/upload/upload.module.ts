import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { LambdaService } from 'src/lambda/lambda.service';

@Module({
  providers: [
    UploadService,
    {
      provide: 'LambdaService',
      useClass: LambdaService,
    },
  ],
  controllers: [UploadController],
})
export class UploadModule {}
