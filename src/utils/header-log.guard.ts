import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class HeaderLoggerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    console.log('Request Headers:', request.headers); // 모든 헤더 출력
    return true; // 인증 로직 추가 가능
  }
}
