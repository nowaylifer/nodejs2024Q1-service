import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UUID } from 'src/types';
import { capitalize } from 'src/utils';

type FavoritesType = 'artist' | 'album' | 'track';

@Injectable()
export class FavoritesService implements OnModuleInit {
  onModuleInit() {
    return this.prisma.favorites.upsert({
      where: { id: 1 },
      create: { id: 1 },
      update: { id: 1 },
    });
  }

  constructor(private readonly prisma: PrismaService) {}

  async add(type: FavoritesType, id: UUID) {
    // @ts-expect-error dynamic access causes type error
    await this.prisma[type].update({
      where: { id },
      data: { favorites: { connect: { id: 1 } } },
    });
  }

  async delete(type: FavoritesType, id: UUID) {
    const favoritesKey = (type + 's') as `${FavoritesType}s`;

    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 1 },
      include: { [favoritesKey]: true },
    });

    const entity = favorites[favoritesKey].find((fav) => fav.id === id);

    if (!entity) {
      throw new NotFoundException(
        `${capitalize(type)} with id ${id} is not favorite`,
      );
    }
    // @ts-expect-error dynamic access causes type error
    this.prisma[type].update({
      where: { id },
      data: { favorites: { disconnect: { id: 1 } } },
    });
  }

  findAll() {
    return this.prisma.favorites.findUnique({
      where: { id: 1 },
      select: { artists: true, albums: true, tracks: true },
    });
  }
}
