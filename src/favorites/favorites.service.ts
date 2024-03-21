import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { UUID } from 'src/types';
import { Favorites } from './entities/favorites.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { asInter, capitalize } from 'src/utils';

type FavoritesType = keyof Favorites;

@Injectable()
export class FavoritesService {
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => ArtistsService))
    private readonly artistsService: ArtistsService,
  ) {}

  private serviceByType = {
    tracks: this.tracksService,
    albums: this.albumsService,
    artists: this.artistsService,
  };

  add(type: FavoritesType, id: UUID) {
    const entity = this.serviceByType[type].findOne(id);
    this.favorites[type].push(asInter(entity));
  }

  delete(type: FavoritesType, id: UUID) {
    const entityIndex = this.favorites[type].findIndex(
      (entity) => entity.id === id,
    );

    if (entityIndex === -1) {
      throw new NotFoundException(
        `${capitalize(type)} with id ${id} is not favorite`,
      );
    }

    this.favorites[type].splice(entityIndex, 1);
  }

  has(type: FavoritesType, id: UUID) {
    return !!asInter(this.favorites[type]).find((value) => value.id === id);
  }

  findAll() {
    return this.favorites;
  }
}
