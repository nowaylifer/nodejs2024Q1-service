import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UUID } from 'src/types';
import { UUIDParam } from './uuid-param';
import { ArtistsService } from 'src/artists/artists.service';

@Injectable()
export class ValidateArtistExist implements PipeTransform<UUID, Promise<UUID>> {
  constructor(private readonly artistsService: ArtistsService) {}

  async transform(value: UUID) {
    try {
      await this.artistsService.findOne(value);
    } catch (error) {
      throw new UnprocessableEntityException(
        `Artist with id "${value}" doesn't exist`,
      );
    }

    return value;
  }
}

export const ArtistIdParam = (name: string) =>
  UUIDParam(name, ValidateArtistExist);
