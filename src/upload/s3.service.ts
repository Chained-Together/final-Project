import { S3RequestPresigner } from '@aws-sdk/s3-request-presigner';
import { formatUrl } from '@aws-sdk/util-format-url';
import { Injectable, Logger } from '@nestjs/common';
import { Hash } from '@smithy/hash-node';
import { HttpRequest } from '@smithy/protocol-http';
import { parseUrl } from '@smithy/url-parser';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  async createPresignedUrlWithoutClient({
    region,
    bucket,
    key,
    fileType, // 파일 타입을 매개변수로 받음
  }: {
    region: string;
    bucket: string;
    key: string;
    fileType: string; // 예: 'video/mp4', 'image/jpeg' 등
  }): Promise<string> {
    // 파일 타입이 'video/*'로 시작하는지 확인
    if (!fileType.startsWith('video/')) {
      throw new Error('이미지는 업로드할 수 없습니다. 비디오 파일만 허용됩니다.');
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
          'Content-Type': fileType, // 클라이언트가 업로드할 파일의 Content-Type을 설정
        },
      }),
    );

    return formatUrl(signedUrlObject);
  }
}
