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
  Req,
} from '@nestjs/common';
import { PersonService } from './person.service';
import { Person } from '../entities/person';
import { Pagination } from 'nestjs-typeorm-paginate';

import { Permissions } from '../middlewares/decorators/permissions.decorator';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';


@Controller('person')
export class PersonController {
  constructor(private readonly service: PersonService) {}

  @Get('public')
  async getPublic() {
    return this.service.findAllPublic();
  }
  
  @Post('public')
  createPublic(@Body() data: Partial<Person>) {
    return this.service.create(data);
  }


  @Get()
  @UseGuards(PermissionsGuard)
  @Permissions('ver_personas')
  getAll(@Query('page') page = 1, @Query('quantity') quantity = 100): Promise<Pagination<Person>> {
    return this.service.paginate({ page: +page, limit: +quantity });
  }

  @Get('me')
  @UseGuards(PermissionsGuard)
  @Permissions('ver_persona')
  getMe(@Req() req) {
    return this.service.findOne(req.user.id);
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('ver_persona')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Get('all')
  @UseGuards(PermissionsGuard)
  @Permissions('ver_personas')
  getAllWithRelations(): Promise<Person[]> {
    return this.service.findAllWithRelations();
  }

  
  @Post()
  @UseGuards(PermissionsGuard)
  @Permissions('crear_persona')
  create(@Body() data: Partial<Person>) {
    return this.service.create(data);
  }

  @Put(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('editar_persona')
  update(@Param('id') id: number, @Body() data: Partial<Person>) {
    return this.service.update(id, data);
  }
  
  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('editar_persona')
  patchUpdate(@Param('id') id: number, @Body() data: Partial<Person>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @Permissions('eliminar_persona')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}