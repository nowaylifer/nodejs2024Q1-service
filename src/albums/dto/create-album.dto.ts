import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'src/types';
import { IsArtistExist } from 'src/validators';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @IsArtistExist()
  @IsUUID('4')
  @IsOptional()
  artistId: UUID | null;
}
