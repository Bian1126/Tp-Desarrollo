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
import { PersonService } from './person.service';
import { Person } from '../entities/person';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Permissions } from '../middlewares/decorators/permissions.decorator';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';

@Controller('person')
@UseGuards(PermissionsGuard)
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Get()
  @Permissions('ver_personas')
  getAll(@Query('page') page = 1, @Query('quantity') quantity = 10): Promise<Pagination<Person>> {
    return this.service.paginate({ page: +page, limit: +quantity });
  }

  @Get(':id')
  @Permissions('ver_persona')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Get('all')
  @Permissions('ver_personas')
  getAllWithRelations(): Promise<Person[]> {
    return this.service.findAllWithRelations();
  }

  @Post()
  @Permissions('crear_persona')
  create(@Body() data: Partial<Person>) {
    return this.service.create(data);
  }

  @Put(':id')
  @Permissions('editar_persona')
  update(@Param('id') id: number, @Body() data: Partial<Person>) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @Permissions('editar_persona')
  patch(@Param('id') id: number, @Body() data: Partial<Person>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @Permissions('eliminar_persona')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
