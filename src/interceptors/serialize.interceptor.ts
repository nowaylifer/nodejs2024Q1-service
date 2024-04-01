import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { map } from 'rxjs';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<unknown>) {}

  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(map((data) => plainToInstance(this.dto, data)));
  }
}

export const Serialize = (dto: ClassConstructor<unknown>) =>
  UseInterceptors(new SerializeInterceptor(dto));
