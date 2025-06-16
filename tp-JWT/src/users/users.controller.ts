import { Body, Controller, Get, Param, Post, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from '../interfaces/login.dto';
import { RegisterDTO } from '../interfaces/register.dto';
import { Request } from 'express';
import { AuthGuard } from '../middlewares/guards/auth.guard';
import { RequestWithUser } from 'src/interfaces/request-user';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';

import { Permissions } from 'src/middlewares/decorators/permissions.decorator';
import { PermissionsGuard } from '../middlewares/guards/permissions.guard';

@Controller('')
export class UsersController {
  constructor(
    private service: UsersService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>, // acceso directo para listar usuarios
  ) {}

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('assign_role')
  @Patch('assign-role/:userId/:roleName')
  async assignRole(
    @Param('userId') userId: string,
    @Param('roleName') roleName: string,
    @Req() req: RequestWithUser,
  ) {
    const userIdNum = parseInt(userId, 10);
    return this.service.assignRoleToUser(userIdNum, roleName);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: RequestWithUser) {
    return {
      email: req.user.email,
    };
  }

  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.service.login(body);
  }

  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.service.register(body);
  }

  @UseGuards(AuthGuard) // este sí, para validar el token y setear request.user
  @Post('can-do')
  async canDo(
  @Req() request: RequestWithUser,
  @Body('permissions') permissions: string[],
  ) {
    const user = request.user;

    const canDo = permissions.every((permission) =>
    this.service.canDo(user, permission),
    );
    return { canDo };
  }

  @Get('refresh-token')
  refreshToken(@Req() request: Request) {
    return this.service.refreshToken(
      request.headers['refresh-token'] as string,
    );
  }

  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions('users_list')
  @Get('users')
  async findAllUsers() {
    return this.userRepo.find({ relations: ['roles', 'roles.permissions'] });
  }

  @UseGuards(AuthGuard)
  @Get('my-permissions')
  getMyPermissions(@Req() req: RequestWithUser) {
    return this.service.getPermissions(req.user);
  }
}
// Este controlador maneja las operaciones relacionadas con los usuarios, incluyendo autenticación, registro, asignación de roles y permisos.
