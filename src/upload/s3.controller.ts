import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('generate-url')
  async generatePresignedUrl(
    @Body()
    body: {
      region: string;
      bucket: string;
      fileName: string;
      fileType: string;
      fileSize: number;
      key: string;
    },
  ) {
    const { region, bucket, fileName, fileType, fileSize, key } = body;
    const presignedUrl = await this.s3Service.createPresignedUrlWithoutClient({
      region,
      bucket,
      key,
      fileType,
      fileSize,
    });

    return { presignedUrl };
  }
}
