import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UUID } from 'src/types';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users = new Map<UUID, User>();

  create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    this.users.set(user.id, user);
    return user;
  }

  findAll() {
    return [...this.users.values()];
  }

  findOne(id: UUID) {
    const user = this.users.get(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  updatePassword(
    id: UUID,
    { oldPassword, newPassword }: UpdateUserPasswordDto,
  ) {
    const user = this.findOne(id);

    if (oldPassword !== user.password) {
      throw new ForbiddenException('Old password is wrong');
    }

    user.password = newPassword;
    user.updateVersion();
    return user;
  }

  remove(id: UUID) {
    const user = this.findOne(id);
    this.users.delete(user.id);
  }
}
