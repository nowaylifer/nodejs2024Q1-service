import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerMiddleware } from './logger.middleware';
import { ConfigurableLoggerModuleClass } from './logger.module-definition';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule extends ConfigurableLoggerModuleClass {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
