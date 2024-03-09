import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUID } from 'src/types';
import { Album } from './entities/album.entity';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumsService {
  private albums = new Map<UUID, Album>();

  constructor(private readonly tracksService: TracksService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const album = new Album(createAlbumDto);
    this.albums.set(album.id, album);
    return album;
  }

  findAll() {
    return [...this.albums.values()];
  }

  findOne(id: UUID) {
    const album = this.albums.get(id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  update(id: UUID, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findOne(id);
    return Object.assign(album, updateAlbumDto);
  }

  remove(id: UUID) {
    const album = this.findOne(id);
    this.albums.delete(album.id);

    this.tracksService
      .findAll()
      .filter((t) => t.albumId === album.id)
      .forEach((t) => (t.albumId = null));
  }
}
