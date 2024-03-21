import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { ArtistsController } from './artists/artists.controller';
import { AlbumsController } from './albums/albums.controller';
import { TracksController } from './tracks/tracks.controller';
import { UsersService } from './users/users.service';
import { ArtistsService } from './artists/artists.service';
import { AlbumsService } from './albums/albums.service';
import { TracksService } from './tracks/tracks.service';
import {
  IsAlbumExistValidator,
  IsArtistExistValidator,
  IsTrackExistValidator,
} from './validators';
import { FavoritesController } from './favorites/favorites.controller';
import { FavoritesService } from './favorites/favorites.service';

@Module({
  imports: [],
  controllers: [
    UsersController,
    ArtistsController,
    AlbumsController,
    TracksController,
    FavoritesController,
  ],
  providers: [
    UsersService,
    ArtistsService,
    AlbumsService,
    TracksService,
    FavoritesService,
    IsAlbumExistValidator,
    IsArtistExistValidator,
    IsTrackExistValidator,
  ],
})
export class AppModule {}
