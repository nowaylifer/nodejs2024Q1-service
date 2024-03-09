import { UUID } from 'src/types';
import { CreateTrackDto } from '../dto/create-track.dto';
import { v4 as uuid } from 'uuid';

export class Track {
  id: UUID;
  name: string;
  artistId: UUID | null;
  albumId: UUID | null;
  duration: number;

  constructor(dto: CreateTrackDto) {
    this.id = uuid();
    Object.assign(this, dto);
  }
}
