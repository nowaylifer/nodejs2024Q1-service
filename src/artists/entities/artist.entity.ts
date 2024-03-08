import { UUID } from 'src/types';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { v4 as uuid } from 'uuid';

export class Artist {
  id: UUID; // uuid v4,
  name: string;
  grammy: boolean;

  constructor(dto: CreateArtistDto) {
    this.id = uuid();
    Object.assign(this, dto);
  }
}
