import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import 'dotenv/config';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { Logger } from '@nestjs/common';

const PORT = +process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useLogger(app.get(LoggerService));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(app.get(HttpAdapterHost).httpAdapter),
  );

  const file = readFileSync(`${__dirname}/../doc/api.yaml`, 'utf8');
  const swaggerDocument = parseYaml(file);

  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(PORT);
}
bootstrap();

const logger = new Logger('Application');

process.on('uncaughtException', (error) => {
  logger.fatal(error.message);
  process.exit();
});

process.on('unhandledRejection', (error) => {
  logger.fatal(
    error && typeof error === 'object' && 'message' in error
      ? error.message
      : String(error),
  );
  process.exit();
});
