import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './interface/token-payload.interface';
import { UUID } from 'src/types';

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

  getJwtTokenPair(user: User) {
    const accessToken = this.getJwtAccessToken(user);
    const refreshToken = this.getJwtRefreshToken(user);
    return { accessToken, refreshToken };
  }

  getJwtAccessToken({ id: userId, login }: User) {
    const payload: TokenPayload = { userId, login };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
      expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'),
    });

    return token;
  }

  getJwtRefreshToken({ id: userId, login }: User) {
    const payload: TokenPayload = { userId, login };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
      expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'),
    });
  }

  async setUserRefreshToken(refreshToken: string, userId: UUID) {
    const refreshTokenHash = await bcrypt.hash(
      refreshToken,
      this.configService.get('CRYPT_SALT'),
    );

    await this.usersService.update(userId, { refreshTokenHash });
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
