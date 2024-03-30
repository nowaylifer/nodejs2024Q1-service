import {
  ClassSerializerInterceptor,
  LogLevel,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import 'dotenv/config';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './interceptors/logger.interceptor';

const PORT = +process.env.PORT;
const LOG_LEVEL = JSON.parse(process.env.LOG_LEVEL) as LogLevel[];

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: LOG_LEVEL });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggerInterceptor(),
  );

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(app.get(HttpAdapterHost).httpAdapter),
  );

  const file = readFileSync(`${__dirname}/../doc/api.yaml`, 'utf8');
  const swaggerDocument = parseYaml(file);
  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(PORT);
}
bootstrap();
