import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Injectable, Logger } from '@nestjs/common';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { parseUrl } from '@smithy/url-parser';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly MAX_FILE_SIZE_MB = 50;
  private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;

  constructor() {
    this.validateAwsCredentials();
  }

  private validateAwsCredentials() {
    if (
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY ||
      !process.env.AWS_REGION
    ) {
      this.logger.error('AWS 자격 증명이 누락되었습니다.');
      throw new Error('AWS 자격 증명이 설정되지 않았습니다.');
    }
  }
  async createPresignedUrlWithoutClient(
    user: UserEntity,
    {
      region,
      bucket,
      fileType,
      fileSize,
    }: {
      region: string;
      bucket: string;
      fileType: string;
      fileSize: number;
    },
  ): Promise<object> {
    const start = Date.now();

    this.logger.log(`프리사인 URL 생성 요청 시작: User=${user.id}, Bucket=${bucket}`);
    if (!fileType.startsWith('video/')) {
      this.logger.warn(`허용되지 않은 파일 형식: ${fileType}`);
      throw new Error('비디오 파일만 업로드할 수 있습니다.');
    }
    if (fileSize > this.MAX_FILE_SIZE_BYTES) {
      const errorMessage = `파일 크기가 너무 큽니다. 최대 크기: ${this.MAX_FILE_SIZE_MB}MB (입력: ${fileSize} Bytes).`;
      this.logger.warn(errorMessage);
      throw new Error(errorMessage);
    }

    const key = await this.createKey(user);

    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
    this.logger.debug(`S3 URL 파싱 완료: ${url}`);

    try {
      const presigner = new S3RequestPresigner({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        region,
        sha256: Hash.bind(null, 'sha256'),
      });

      const signedUrlObject = await presigner.presign(
        new HttpRequest({
          ...url,
          method: 'PUT',
          headers: {
            'Content-Type': fileType,
          },
        }),
      );

      const presignedUrl = formatUrl(signedUrlObject);
      const duration = Date.now() - start;

      this.logger.log(`프리사인 URL 생성 완료: User=${user.id}, Duration=${duration}ms`);
      this.logger.debug(`생성된 프리사인 URL: ${presignedUrl}`);

      return { presignedUrl, key };
    } catch (error) {
      this.logger.error(`프리사인 URL 생성 실패: User=${user.id}`, error.stack);
      throw new Error('S3 프리사인 URL 생성 중 문제가 발생했습니다.');
    }
  }
  private async createKey(user: UserEntity): Promise<string> {
    const userId = user.id;
    const timestamp = Date.now();
    const uniqueKey = `uploads/${userId}_${timestamp}`;
    this.logger.debug(`S3 키 생성 완료: ${uniqueKey}`);
    return uniqueKey;
  }
}
