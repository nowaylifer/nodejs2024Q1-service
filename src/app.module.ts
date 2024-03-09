import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ArtistsController } from './artists/artists.controller';
import { AlbumsController } from './albums/albums.controller';
import { TracksController } from './tracks/tracks.controller';
import { UsersService } from './users/users.service';
import { ArtistsService } from './artists/artists.service';
import { AlbumsService } from './albums/albums.service';
import { TracksService } from './tracks/tracks.service';
import { IsAlbumExistValidator, IsArtistExistValidator } from './validators';

@Module({
  imports: [],
  controllers: [
    UsersController,
    ArtistsController,
    AlbumsController,
    TracksController,
  ],
  providers: [
    UsersService,
    ArtistsService,
    AlbumsService,
    TracksService,
    IsAlbumExistValidator,
    IsArtistExistValidator,
  ],
})
export class AppModule {}
