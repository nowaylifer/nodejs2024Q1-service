import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UUID } from 'src/types';
import { UUIDParam } from 'src/decorators';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: UUID) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  updatePassword(
    @UUIDParam('id') id: UUID,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(id, updateUserPasswordDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@UUIDParam('id') id: UUID) {
    return this.usersService.remove(id);
  }
}
