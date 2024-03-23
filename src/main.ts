import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import 'dotenv/config';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';
import { AppModule } from './app.module';

const PORT = +process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(
    new PrismaClientExceptionFilter(app.get(HttpAdapterHost).httpAdapter),
  );

  const file = readFileSync(`${__dirname}/../doc/api.yaml`, 'utf8');
  const swaggerDocument = parseYaml(file);
  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(PORT);
}
bootstrap();
