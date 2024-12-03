// import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
// import { formatUrl } from '@aws-sdk/util-format-url';
// import { Injectable, Logger } from '@nestjs/common';
// import { Hash } from '@smithy/hash-node';
// import { HttpRequest } from '@smithy/protocol-http';
// import { parseUrl } from '@smithy/url-parser';
// import { UserEntity } from 'src/user/entities/user.entity';

// @Injectable()
// export class S3Service {
//   private readonly logger = new Logger(S3Service.name);
//   private readonly MAX_FILE_SIZE_MB = 50;
//   private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024;

//   async createPresignedUrlWithoutClient(
//     user: UserEntity,
//     {
//       region,
//       bucket,
//       fileType,
//       fileSize,
//     }: {
//       region: string;
//       bucket: string;
//       fileType: string;
//       fileSize: number;
//     },
//   ): Promise<object> {
//     if (!fileType.startsWith('video/')) {
//       throw new Error('이미지는 업로드할 수 없습니다. 비디오 파일만 허용됩니다.');
//     }

//     if (fileSize > this.MAX_FILE_SIZE_BYTES) {
//       throw new Error(
//         `파일 크기가 너무 큽니다. 최대 허용 크기는 ${this.MAX_FILE_SIZE_BYTES}MB입니다.`,
//       );
//     }

//     const key = await this.createKey(user);

//     const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);

//     // Pre-signed URL을 생성하기 위한 presigner 객체 설정
//     const presigner = new S3RequestPresigner({
//       credentials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//       },
//       region: process.env.AWS_REGION,
//       sha256: Hash.bind(null, 'sha256'),
//     });

//     // Pre-signed URL을 요청에 맞게 서명하여 생성
//     const signedUrlObject = await presigner.presign(
//       new HttpRequest({
//         ...url,
//         method: 'PUT',
//         headers: {
//           'Content-Type': fileType,
//         },
//       }),
//     );

//     return { presignedUrl: formatUrl(signedUrlObject), key };
//   }

//   private async createKey(user: UserEntity) {
//     const userId = user.id;
//     const timestamp = Date.now();
//     const uniqueKey = `uploads/${userId}_${timestamp}`;
//     return uniqueKey;
//   }
// }

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

  /**
   * AWS 자격 증명을 검증합니다.
   */
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

  /**
   * S3에 업로드를 위한 프리사인 URL 생성
   */
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

    // 파일 타입 검증
    if (!fileType.startsWith('video/')) {
      this.logger.warn(`허용되지 않은 파일 형식: ${fileType}`);
      throw new Error('비디오 파일만 업로드할 수 있습니다.');
    }

    // 파일 크기 검증
    if (fileSize > this.MAX_FILE_SIZE_BYTES) {
      const errorMessage = `파일 크기가 너무 큽니다. 최대 크기: ${this.MAX_FILE_SIZE_MB}MB (입력: ${fileSize} Bytes).`;
      this.logger.warn(errorMessage);
      throw new Error(errorMessage);
    }

    const key = await this.createKey(user);

    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);
    this.logger.debug(`S3 URL 파싱 완료: ${url}`);

    try {
      // Pre-signed URL을 생성하기 위한 presigner 객체 설정
      const presigner = new S3RequestPresigner({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
        region,
        sha256: Hash.bind(null, 'sha256'),
      });

      // Pre-signed URL을 요청에 맞게 서명하여 생성
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

  /**
   * S3 키 생성
   */
  private async createKey(user: UserEntity): Promise<string> {
    const userId = user.id;
    const timestamp = Date.now();
    const uniqueKey = `uploads/${userId}_${timestamp}`;
    this.logger.debug(`S3 키 생성 완료: ${uniqueKey}`);
    return uniqueKey;
  }
}
