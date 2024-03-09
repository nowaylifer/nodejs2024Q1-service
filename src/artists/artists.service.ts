import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUID } from 'src/types';
import { Artist } from './entities/artist.entity';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';

@Injectable()
export class ArtistsService {
  private artists = new Map<UUID, Artist>();

  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
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
      throw new NotFoundException('Artist not found');
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
  }
}
