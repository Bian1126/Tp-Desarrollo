import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

//Cambiamos el get por getAllAndOverride para permitir metadata a nivel clase y método
//Esto hace que, si definimos permisos a nivel clase, también se respeten.
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
//Controlar que user exista antes de acceder a sus roles, para evitar error runtime.
    if (!user || !user.permissionCodes) {
      throw new ForbiddenException('Usuario no autenticado o sin permisos');
    }

    const userPermissions = user.permissionCodes;

    const hasAllPermissions = requiredPermissions.every(p =>
      userPermissions.includes(p),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException('Permisos insuficientes');
    }

    return true;
  }
}
