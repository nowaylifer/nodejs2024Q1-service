import Joi from 'joi';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { LoggerModule } from './logger/logger.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FavoritesModule } from './favorites/favorites.module';
import { validateLogLevelsEnvVar } from './utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        CRYPT_SALT: Joi.number().required(),
        JWT_SECRET_KEY: Joi.string().required(),
        TOKEN_EXPIRE_TIME: Joi.string().required(),
        JWT_SECRET_REFRESH_KEY: Joi.string().required(),
        TOKEN_REFRESH_EXPIRE_TIME: Joi.string().required(),
        LOG_DIR: Joi.string().required(),
        LOG_TO_FILE: Joi.bool().required(),
        LOG_FILE_MAX_SIZE: Joi.number().required(),
        LOG_LEVELS: Joi.custom(validateLogLevelsEnvVar).required(),
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        timestamp: true,
        logDir: configService.get('LOG_DIR'),
        logLevels: configService.get('LOG_LEVELS'),
        saveToFile: configService.get('LOG_TO_FILE'),
        maxFileSize: configService.get('LOG_FILE_MAX_SIZE'),
      }),
    }),
    PrismaModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
