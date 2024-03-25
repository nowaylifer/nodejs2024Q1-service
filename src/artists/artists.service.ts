import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UUID } from 'src/types';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createArtistDto: CreateArtistDto) {
    return this.prisma.artist.create({ data: createArtistDto });
  }

  findAll() {
    return this.prisma.artist.findMany();
  }

  findOne(id: UUID) {
    return this.prisma.artist.findUniqueOrThrow({ where: { id } });
  }

  update(id: UUID, updateArtistDto: UpdateArtistDto) {
    return this.prisma.artist.update({ data: updateArtistDto, where: { id } });
  }

  remove(id: UUID) {
    return this.prisma.artist.delete({ where: { id } });
  }
}
