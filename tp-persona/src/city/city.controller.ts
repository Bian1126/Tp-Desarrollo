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
import { CityService } from './city.service';
import { City } from '../entities/city';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Permissions } from '../middlewares/decorators/permissions.decorator';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';

@Controller('city')
// @UseGuards(PermissionsGuard)
export class CityController {
  constructor(private readonly service: CityService) {}
  
  @Get('public')
  getAllPublic(
    @Query('page') page = 1,
    @Query('quantity') quantity = 10,
  ): Promise<Pagination<City>> {
    return this.service.paginate({ page: +page, limit: +quantity });
  }

  @Get()
  @Permissions('ver_ciudades')
  getAll(@Query('page') page = 1, @Query('quantity') quantity = 10): Promise<Pagination<City>> {
    return this.service.paginate({ page: +page, limit: +quantity });
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('ver_ciudad')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('crear_ciudad')
  create(@Body() data: Partial<City>) {
    return this.service.create(data);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('editar_ciudad')
  update(@Param('id') id: number, @Body() data: Partial<City>) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('editar_ciudad')
  patch(@Param('id') id: number, @Body() data: Partial<City>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('eliminar_ciudad')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
