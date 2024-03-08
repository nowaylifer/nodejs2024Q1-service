import { UUID } from 'src/types';
import { CreateUserDto } from '../dto/create-user.dto';
import { v4 as uuid } from 'uuid';
import { Exclude } from 'class-transformer';

export class User {
  readonly id: UUID; // uuid v4
  readonly login: string;

  @Exclude()
  password: string;

  version: number; // integer number, increments on update
  readonly createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update

  constructor(dto: CreateUserDto) {
    this.id = uuid();
    Object.assign(this, dto);
    this.version = 1;
    this.updatedAt = this.createdAt = Date.now();
  }

  updateVersion() {
    this.updatedAt = Date.now();
    this.version++;
  }
}
