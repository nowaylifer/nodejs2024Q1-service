import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UUID } from 'src/types';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTrackDto: CreateTrackDto) {
    return this.prisma.track.create({ data: createTrackDto });
  }

  findAll() {
    return this.prisma.track.findMany();
  }

  findOne(id: UUID) {
    return this.prisma.track.findUniqueOrThrow({ where: { id } });
  }

  update(id: UUID, updateTrackDto: UpdateTrackDto) {
    return this.prisma.track.update({ data: updateTrackDto, where: { id } });
  }

  remove(id: UUID) {
    return this.prisma.track.delete({ where: { id } });
  }
}
