import {
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TracksService } from 'src/tracks/tracks.service';
import { UUID } from 'src/types';
import { UUIDParam } from './uuid-param';

@Injectable()
export class ValidateTrackExist implements PipeTransform<UUID, Promise<UUID>> {
  constructor(private readonly tracksService: TracksService) {}

  async transform(value: UUID) {
    try {
      await this.tracksService.findOne(value);
    } catch (error) {
      throw new UnprocessableEntityException(
        `Track with id "${value}" doesn't exist`,
      );
    }

    return value;
  }
}

export const TrackIdParam = (name: string) =>
  UUIDParam(name, ValidateTrackExist);
