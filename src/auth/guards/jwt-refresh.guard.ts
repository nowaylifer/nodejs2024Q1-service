import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    if (info instanceof JsonWebTokenError) {
      if (info.message === 'No auth token') {
        throw new UnauthorizedException('No refresh token');
      }

      if (info.message === 'jwt malformed') {
        throw new ForbiddenException('Invalid refresh token');
      }

      throw new ForbiddenException();
    }

    return super.handleRequest(err, user, info, context, status);
  }
}
