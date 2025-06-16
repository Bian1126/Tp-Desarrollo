import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CountryService } from './country.service';
import { Country } from '../entities/country';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Permissions } from '../middlewares/decorators/permissions.decorator';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';

@Controller('country')
@UseGuards(PermissionsGuard)
export class CountryController {
  constructor(private readonly service: CountryService) {}

  @Get()
  @Permissions('ver_paises')
  getAll(@Query('page') page = 1, @Query('quantity') quantity = 10): Promise<Pagination<Country>> {
    return this.service.paginate({ page: +page, limit: +quantity });
  }

  @Get(':id')
  @Permissions('ver_pais')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Permissions('crear_pais')
  create(@Body() data: Partial<Country>) {
    return this.service.create(data);
  }

  @Put(':id')
  @Permissions('editar_pais')
  update(@Param('id') id: number, @Body() data: Partial<Country>) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @Permissions('editar_pais')
  patch(@Param('id') id: number, @Body() data: Partial<Country>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Permissions('eliminar_pais')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
