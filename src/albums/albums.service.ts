import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UUID } from 'src/types';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAlbumDto: CreateAlbumDto) {
    return this.prisma.album.create({ data: createAlbumDto });
  }

  findAll() {
    return this.prisma.album.findMany();
  }

  findOne(id: UUID) {
    return this.prisma.album.findUniqueOrThrow({ where: { id } });
  }

  update(id: UUID, updateAlbumDto: UpdateAlbumDto) {
    return this.prisma.album.update({
      data: updateAlbumDto,
      where: { id },
    });
  }

  remove(id: UUID) {
    return this.prisma.album.delete({ where: { id } });
  }
}
