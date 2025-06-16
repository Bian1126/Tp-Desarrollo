import { Controller, Post, Body, UseGuards, Req, Param, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Permissions } from '../middlewares/decorators/permissions.decorator';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';

@Controller('roles')
@UseGuards(AuthGuard,PermissionsGuard)
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Post()
  @Permissions('roles_create')
  create(@Body() body: { name: string; permissionIds: number[] }) {
    return this.service.createRole(body.name, body.permissionIds);
  }

  @Post(':id/assign')
  @Permissions('roles_assign')
  async assignRoleToUser(
    @Param('id', ParseIntPipe) userId : number, 
    @Body() body: { roleIds: number[] } // corregido nombre
  ) {
    return this.service.assignRolesToUser(userId, body.roleIds); // corregido método
  }

}
