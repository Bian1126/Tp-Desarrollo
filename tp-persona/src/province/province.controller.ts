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
import { ProvinceService } from './province.service';
import { Province } from '../entities/province';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Permissions } from '../middlewares/decorators/permissions.decorator';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';

@Controller('province')
@UseGuards(PermissionsGuard)
export class ProvinceController {
  constructor(private readonly service: ProvinceService) {}

  @Get()
  @Permissions('ver_provincias')
  getAll(@Query('page') page = 1, @Query('quantity') quantity = 10): Promise<Pagination<Province>> {
    return this.service.paginate({ page: +page, limit: +quantity });
  }

  @Get(':id')
  @Permissions('ver_provincia')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Permissions('crear_provincia')
  create(@Body() data: Partial<Province>) {
    return this.service.create(data);
  }

  @Put(':id')
  @Permissions('editar_provincia')
  update(@Param('id') id: number, @Body() data: Partial<Province>) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @Permissions('editar_provincia')
  patch(@Param('id') id: number, @Body() data: Partial<Province>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Permissions('eliminar_provincia')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}