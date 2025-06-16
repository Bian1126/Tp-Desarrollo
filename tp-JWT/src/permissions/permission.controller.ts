import { Controller, Post, Get, Body, UseGuards, Req} from '@nestjs/common';
import { PermissionsService } from './permission.service';
import { AuthGuard } from 'src/middlewares/guards/auth.guard';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';
import { RequestWithUser } from 'src/interfaces/request-user';
import { Permissions } from '../middlewares/decorators/permissions.decorator';
@Controller('permissions')
@UseGuards(PermissionsGuard, AuthGuard)
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @UseGuards(AuthGuard)
  @Get('my-permissions')
  getMyPermissions(@Req() req: RequestWithUser) {
    console.log('Usuario recibido en /permissions/my-permissions:', req.user);
    return this.service.getPermissions(req.user);
  }

  @Post()
  @Permissions('permission_create')
  create(@Body() body: { name: string }) {
    return this.service.createPermission(body.name);
  }

  @Get()
  @Permissions('permission_list')
  findAll() {
    return this.service.findAll();
  }
}


