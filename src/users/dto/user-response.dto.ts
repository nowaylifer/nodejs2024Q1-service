import { User } from '@prisma/client';
import { Exclude, Type } from 'class-transformer';

export class UserResponseDto implements User {
  id: string;
  login: string;
  version: number;

  @Exclude()
  password: string;

  @Type(() => Number)
  createdAt: Date;

  @Type(() => Number)
  updatedAt: Date;
}
