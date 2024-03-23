import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UUID } from 'src/types';
import { capitalize } from 'src/utils';

type FavoritesType = 'artist' | 'album' | 'track';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(type: FavoritesType, id: UUID) {
    // @ts-expect-error dynamic access causes type error
    return await this.prisma[type].update({
      where: { id },
      data: { favorites: { connect: { id: 1 } } },
    });
  }

  async delete(type: FavoritesType, id: UUID) {
    const favoritesKey = (type + 's') as `${FavoritesType}s`;

    await new Promise((res) => setTimeout(res, 10));

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
    return await this.prisma[type].update({
      where: { id },
      data: { favorites: { disconnect: { id: 1 } } },
    });
  }

  async findAll() {
    await new Promise((res) => setTimeout(res, 10));
    return await this.prisma.favorites.findUnique({
      where: { id: 1 },
      include: { albums: true, artists: true, tracks: true },
    });
  }
}
