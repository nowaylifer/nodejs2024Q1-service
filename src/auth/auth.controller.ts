import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './interface/request-with-user.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { TransformDataInterceptor } from 'src/interceptors/transform-data.interceptor';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(new TransformDataInterceptor(UserResponseDto))
  async signUp(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    return response.send({
      accessToken: this.authService.getJwtToken(request.user),
    });
  }
}
