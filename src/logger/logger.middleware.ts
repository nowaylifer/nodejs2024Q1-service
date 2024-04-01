import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response, Request } from 'express';
import { LoggerService } from './logger.service';

const CONTEXT = 'HTTP';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('close', () => {
      const { method, originalUrl, body, query } = req;
      const { statusCode } = res;

      const message = `${method} ${originalUrl} ${statusCode} ${JSON.stringify(body ?? {})} ${JSON.stringify(query)}`;

      if (statusCode >= 500) {
        return this.logger.error(message, CONTEXT);
      }

      if (statusCode >= 400) {
        return this.logger.warn(message, CONTEXT);
      }

      return this.logger.log(message, CONTEXT);
    });

    next();
  }
}
