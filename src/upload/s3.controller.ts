import { Body, Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { S3Service } from './s3.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('s3')
export class S3Controller {
  private readonly logger = new Logger(S3Controller.name);

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

    // 시작 로깅
    this.logger.log(`User ${user.id} is requesting a presigned URL`);
    this.logger.debug(
      `Request Details: ${JSON.stringify({ region, bucket, fileName, fileType, fileSize })}`,
    );

    // Presigned URL 생성
    const presignedUrl = await this.s3Service.createPresignedUrlWithoutClient(user, {
      region,
      bucket,
      fileType,
      fileSize,
    });

    const duration = Date.now();

    this.logger.log(`Presigned URL generated in ${duration}ms`);
    return presignedUrl;
  }
}
