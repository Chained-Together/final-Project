import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { S3Service } from './s3.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('generate-url')
  @UseGuards(AuthGuard('jwt'))
  async generatePresignedUrl(
    @UserInfo() user: UserEntity,
    @Body()
    body: {
      region: string;
      bucket: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    },
  ) {
    const { region, bucket, fileName, fileType, fileSize } = body;
    const presignedUrl = await this.s3Service.createPresignedUrlWithoutClient(user, {
      region,
      bucket,
      fileType,
      fileSize,
    });

    return presignedUrl;
  }
}
