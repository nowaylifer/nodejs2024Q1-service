import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UUID } from 'src/types';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  private tracks = new Map<UUID, Track>();

  create(createTrackDto: CreateTrackDto) {
    const track = new Track(createTrackDto);
    this.tracks.set(track.id, track);
    return track;
  }

  findAll() {
    return [...this.tracks.values()];
  }

  findOne(id: UUID) {
    const track = this.tracks.get(id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  update(id: UUID, updateTrackDto: UpdateTrackDto) {
    const track = this.findOne(id);
    return Object.assign(track, updateTrackDto);
  }

  remove(id: UUID) {
    const track = this.findOne(id);
    this.tracks.delete(track.id);
  }
}
