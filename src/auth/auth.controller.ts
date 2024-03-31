import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interface/request-with-user.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from 'src/decorators/public';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Serialize(UserResponseDto)
  async signUp(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { accessToken, refreshToken } = this.authService.getJwtTokenPair(
      request.user,
    );

    await this.authService.setUserRefreshToken(refreshToken, request.user.id);

    return response.send({ accessToken, refreshToken });
  }

  @HttpCode(200)
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() request: RequestWithUser, @Res() response: Response) {
    const { accessToken, refreshToken } = this.authService.getJwtTokenPair(
      request.user,
    );

    await this.authService.setUserRefreshToken(refreshToken, request.user.id);

    return response.send({ accessToken, refreshToken });
  }
}
