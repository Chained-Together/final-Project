import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Injectable, Logger } from '@nestjs/common';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { parseUrl } from '@smithy/url-parser';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly MAX_FILE_SIZE_MB = 50;
  private readonly MAX_FILE_SIZE_BYTES = this.MAX_FILE_SIZE_MB * 1024 * 1024; 

  async createPresignedUrlWithoutClient({
    region,
    bucket,
    key,
    fileType,
    fileSize,
  }: {
    region: string; 
    bucket: string;
    key: string;
    fileType: string; 
    fileSize: number;
  }): Promise<string> {
    
    if (!fileType.startsWith('video/')) {
      throw new Error('이미지는 업로드할 수 없습니다. 비디오 파일만 허용됩니다.');
    }

    if (fileSize > this.MAX_FILE_SIZE_BYTES) {
      throw new Error(
        `파일 크기가 너무 큽니다. 최대 허용 크기는 ${this.MAX_FILE_SIZE_BYTES}MB입니다.`,
      );
    }

    const url = parseUrl(`https://${bucket}.s3.${region}.amazonaws.com/${key}`);

    // Pre-signed URL을 생성하기 위한 presigner 객체 설정
    const presigner = new S3RequestPresigner({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      region: process.env.AWS_REGION,
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

    return formatUrl(signedUrlObject);
  }
}
