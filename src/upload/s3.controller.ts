import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/user-info.decorator';
import { S3Service } from './s3.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiOkResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('S3 파일 업로드 API') // Swagger 그룹 태그
@Controller('s3')
export class S3Controller {
  private readonly logger = new Logger(S3Controller.name);

  constructor(private readonly s3Service: S3Service) {}

  @Post('generate-url')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'S3 Pre-signed URL 생성',
    description: 'AWS S3에 파일 업로드를 위한 Pre-signed URL을 생성합니다. JWT 인증이 필요합니다.',
  })
  @ApiBody({
    description: 'Pre-signed URL 생성에 필요한 정보',
    schema: {
      type: 'object',
      properties: {
        region: { type: 'string', description: 'S3 버킷의 리전' },
        bucket: { type: 'string', description: 'S3 버킷 이름' },
        fileName: { type: 'string', description: '업로드할 파일 이름' },
        fileType: { type: 'string', description: '업로드할 파일의 MIME 타입' },
        fileSize: { type: 'number', description: '업로드할 파일의 크기 (바이트 단위)' },
      },
      required: ['region', 'bucket', 'fileName', 'fileType', 'fileSize'],
    },
  })
  @ApiOkResponse({
    description: 'Pre-signed URL이 성공적으로 생성되었습니다.',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: '생성된 Pre-signed URL' },
      },
    },
  })
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

    // Pre-signed URL 생성
    const presignedUrl = await this.s3Service.createPresignedUrlWithoutClient(user, {
      region,
      bucket,
      fileType,
      fileSize,
    });

    const duration = Date.now();

    console.log(presignedUrl);

    this.logger.log(`Pre-signed URL generated in ${duration}ms`);
    return presignedUrl;
  }
}
