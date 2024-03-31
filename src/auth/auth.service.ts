import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async register({ login, password }: RegisterDto) {
    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get('CRYPT_SALT'),
    );
    return this.usersService.create({ login, password: hashedPassword });
  }

  async getAuthenticUser(
    login: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.findOneByLogin(login);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new ForbiddenException('Incorrect login or password');
    }
  }

  getJwtToken({ id: userId, login }: User) {
    const payload: TokenPayload = { userId, login };
    return this.jwtService.sign(payload);
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new ForbiddenException('Incorrect login or password');
    }
  }
}
