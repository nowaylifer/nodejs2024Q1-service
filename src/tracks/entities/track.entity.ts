import { UUID } from 'src/types';
import { CreateTrackDto } from '../dto/create-track.dto';
import { v4 as uuid } from 'uuid';

export class Track {
  id: UUID;
  name: string;
  artistId: UUID | null;
  albumId: UUID | null;
  duration: number;

  constructor({
    name,
    artistId = null,
    albumId = null,
    duration,
  }: CreateTrackDto) {
    this.id = uuid();
    this.name = name;
    this.artistId = artistId;
    this.albumId = albumId;
    this.duration = duration;
  }
}
