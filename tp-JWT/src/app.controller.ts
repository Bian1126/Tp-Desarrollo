import { Controller, Get, UseGuards, Post, Body, Req } from '@nestjs/common';
import { Permissions } from './middlewares/decorators/permissions.decorator';
import { PermissionsGuard } from './middlewares/guards/permissions.guard';
import { AuthGuard } from './middlewares/guards/auth.guard';
import { RequestWithUser } from './interfaces/request-user';

@Controller()
export class AppController {
  constructor() {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('view_status')
  @Get()
  getHello(): string {
    return 'status:OK';
  }

  @UseGuards(AuthGuard)
  @Post('can-do')
  async canDo(
    @Req() request: RequestWithUser,
    @Body('permissions') permissions: string[],
  ) {
    console.log('Usuario recibido:', request.user);
    console.log('Permisos solicitados:', permissions);
    const user = request.user;
    try {
      const canDo = permissions.every(p => user.permissionCodes.includes(p));
      return { canDo };
    } catch (error) { 
      console.error('Error en / can-do:', error);
      throw error;
    }
  }
}
