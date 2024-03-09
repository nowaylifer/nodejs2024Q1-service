import { UUID } from 'src/types';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { v4 as uuid } from 'uuid';

export class Album {
  id: UUID;
  name: string;
  year: number;
  artistId: UUID | null;

  constructor(dto: CreateAlbumDto) {
    this.id = uuid();
    Object.assign(this, dto);
  }
}
