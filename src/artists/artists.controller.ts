import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUID } from 'src/types';
import { UUIDParam } from 'src/decorators';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistsService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: UUID) {
    return this.artistsService.findOne(id);
  }

  @Put(':id')
  update(@UUIDParam('id') id: UUID, @Body() updateArtistDto: UpdateArtistDto) {
    return this.artistsService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@UUIDParam('id') id: UUID) {
    return this.artistsService.remove(id);
  }
}
