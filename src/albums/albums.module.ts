import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { IsAlbumExistValidator } from './is-album-exist.validator';
import { ValidateAlbumExist } from './validate-album-exist.pipe';

@Module({
  imports: [],
  providers: [AlbumsService, IsAlbumExistValidator, ValidateAlbumExist],
  exports: [AlbumsService, IsAlbumExistValidator, ValidateAlbumExist],
  controllers: [AlbumsController],
})
export class AlbumsModule {}
