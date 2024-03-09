import 'dotenv/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'node:fs';
import { parse as parseYaml } from 'yaml';

const PORT = +process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const file = readFileSync(`${__dirname}/../doc/api.yaml`, 'utf8');
  const swaggerDocument = parseYaml(file);
  SwaggerModule.setup('/', app, swaggerDocument);

  await app.listen(PORT);
}
bootstrap();
