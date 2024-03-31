import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { IsTrackExistValidator } from './is-track-exist.validator';
import { ValidateTrackExist } from './validate-track-exist.pipe';

@Module({
  imports: [],
  providers: [TracksService, IsTrackExistValidator, ValidateTrackExist],
  exports: [TracksService, IsTrackExistValidator, ValidateTrackExist],
  controllers: [TracksController],
})
export class TracksModule {}
