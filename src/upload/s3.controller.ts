import { Body, Controller, Post } from '@nestjs/common';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('generate-url')
  async generatePresignedUrl(
    @Body() body: { region: string; bucket: string; fileName: string; fileType: string },
  ) {
    const { region, bucket, fileName, fileType } = body;

    
    const key = `uploads/${Date.now()}_${fileName}`;

    const presignedUrl = await this.s3Service.createPresignedUrlWithoutClient({
      region,
      bucket,
      key,
      fileType,
    });

    return { presignedUrl };
  }
}
