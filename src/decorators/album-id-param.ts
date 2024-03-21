import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UUID } from 'src/types';
import { UUIDParam } from './uuid-param';
import { AlbumsService } from 'src/albums/albums.service';

@Injectable()
export class ValidateAlbumExist implements PipeTransform<UUID, UUID> {
  constructor(private readonly albumsService: AlbumsService) {}

  transform(value: UUID) {
    try {
      this.albumsService.findOne(value);
    } catch (error) {
      throw new UnprocessableEntityException(
        `Album with id "${value}" doesn't exist`,
      );
    }
    return value;
  }
}

export const AlbumIdParam = (name: string) =>
  UUIDParam(name, ValidateAlbumExist);
