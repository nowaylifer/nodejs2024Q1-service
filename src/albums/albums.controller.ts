import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUIDParam } from 'src/decorators';
import { UUID } from 'src/types';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('album')
@UseGuards(JwtAuthGuard)
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: UUID) {
    return this.albumsService.findOne(id);
  }

  @Put(':id')
  update(@UUIDParam('id') id: UUID, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@UUIDParam('id') id: UUID) {
    return this.albumsService.remove(id);
  }
}
