import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TracksModule } from 'src/tracks/tracks.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { ArtistsModule } from 'src/artists/artists.module';

@Module({
  imports: [TracksModule, AlbumsModule, ArtistsModule],
  providers: [FavoritesService],
  exports: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
