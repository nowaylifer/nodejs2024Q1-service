import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'src/types';
import { IsAlbumExist } from 'src/albums/is-album-exist.validator';
import { IsArtistExist } from 'src/artists/is-artist-exist.validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArtistExist()
  @IsUUID('4')
  @IsOptional()
  artistId: UUID | null;

  @IsAlbumExist()
  @IsUUID('4')
  @IsOptional()
  albumId: UUID | null;

  @IsNumber()
  duration: number;
}
