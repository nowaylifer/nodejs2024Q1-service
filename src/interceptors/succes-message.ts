import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class SuccessMessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((res) => this.responseHandler(res, context)));
  }

  responseHandler(res: unknown, context: ExecutionContext) {
    if (typeof res !== 'string') return res;

    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return {
      statusCode: response.statusCode,
      message: res,
    };
  }
}
