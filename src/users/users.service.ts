import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { UUID } from 'src/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: UUID) {
    return this.prisma.user.findUniqueOrThrow({ where: { id } });
  }

  findOneByLogin(login: string) {
    return this.prisma.user.findFirstOrThrow({ where: { login } });
  }

  async updatePassword(
    id: UUID,
    { oldPassword, newPassword }: UpdateUserPasswordDto,
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });

    if (oldPassword !== user.password) {
      throw new ForbiddenException('Old password is wrong');
    }

    return this.prisma.user.update({
      where: { id },
      data: { password: newPassword, version: { increment: 1 } },
    });
  }

  remove(id: UUID) {
    return this.prisma.user.delete({ where: { id } });
  }
}
