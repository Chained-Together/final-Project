import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtQueryAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = request.query.token;
    if (token) {
      request.headers.authorization = `Bearer ${token}`;
      console.log('Token set in headers:', request.headers.authorization);
    }

    return super.canActivate(context);
  }
}
