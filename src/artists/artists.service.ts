import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUID } from 'src/types';
import { Artist } from './entities/artist.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistsService {
  private artists = new Map<UUID, Artist>();

  constructor(
    @Inject(forwardRef(() => TracksService))
    private readonly tracksService: TracksService,

    @Inject(forwardRef(() => AlbumsService))
    private readonly albumsService: AlbumsService,

    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  create(createArtistDto: CreateArtistDto) {
    const artist = new Artist(createArtistDto);
    this.artists.set(artist.id, artist);
    return artist;
  }

  findAll() {
    return [...this.artists.values()];
  }

  findOne(id: UUID) {
    const artist = this.artists.get(id);
    if (!artist) {
      throw new NotFoundException('Artist was not found');
    }
    return artist;
  }

  update(id: UUID, updateArtistDto: UpdateArtistDto) {
    const artist = this.findOne(id);
    return Object.assign(artist, updateArtistDto);
  }

  remove(id: UUID) {
    const artist = this.findOne(id);
    this.artists.delete(artist.id);

    this.albumsService
      .findAll()
      .filter((a) => a.artistId === artist.id)
      .forEach((a) => (a.artistId = null));

    this.tracksService
      .findAll()
      .filter((t) => t.artistId === artist.id)
      .forEach((t) => (t.artistId = null));

    if (this.favoritesService.has('artists', artist.id)) {
      this.favoritesService.delete('artists', artist.id);
    }
  }
}
