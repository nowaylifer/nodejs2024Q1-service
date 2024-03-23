import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { UUID } from 'src/types';
import { AlbumIdParam, ArtistIdParam, TrackIdParam } from 'src/decorators';
import { SuccessMessageInterceptor } from 'src/interceptors/succes-message.interceptor';

@UseInterceptors(SuccessMessageInterceptor)
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('track/:id')
  addTrack(@TrackIdParam('id') id: UUID) {
    this.favoritesService.add('track', id);
    return `Track ${id} has been added to favorites`;
  }

  @Delete('track/:id')
  @HttpCode(204)
  deleteTrack(@TrackIdParam('id') id: UUID) {
    this.favoritesService.delete('track', id);
  }

  @Post('album/:id')
  addAlbum(@AlbumIdParam('id') id: UUID) {
    this.favoritesService.add('album', id);
    return `Album ${id} has been added to favorites`;
  }

  @Delete('album/:id')
  @HttpCode(204)
  deleteAlbum(@AlbumIdParam('id') id: UUID) {
    this.favoritesService.delete('album', id);
  }

  @Post('artist/:id')
  addArtist(@ArtistIdParam('id') id: UUID) {
    this.favoritesService.add('artist', id);
    return `Artist ${id} has been added to favorites`;
  }

  @Delete('artist/:id')
  @HttpCode(204)
  deleteArtist(@ArtistIdParam('id') id: UUID) {
    this.favoritesService.delete('artist', id);
  }
}
