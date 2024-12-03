import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as apm from 'elastic-apm-node';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    // 트랜잭션 시작
    const transaction = apm.startTransaction(
      `${request.method} ${request.url}`, // 트랜잭션 이름
      'request',
    );

    return next.handle().pipe(
      tap(() => {
        if (transaction) {
          // 상태 코드 및 결과를 추가
          transaction.result = `${response.statusCode}`;
          transaction.end(); // 트랜잭션 종료
        }
      }),
    );
  }
}
