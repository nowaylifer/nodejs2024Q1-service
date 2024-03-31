import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { IsArtistExistValidator } from './is-artist-exist.validator';
import { ValidateArtistExist } from './validate-artist-exist.pipe';

@Module({
  imports: [],
  providers: [ArtistsService, IsArtistExistValidator, ValidateArtistExist],
  exports: [ArtistsService, IsArtistExistValidator, ValidateArtistExist],
  controllers: [ArtistsController],
})
export class ArtistsModule {}
