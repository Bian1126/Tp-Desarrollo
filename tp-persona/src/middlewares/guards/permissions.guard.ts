import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import axios from 'axios';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtener los permisos requeridos definidos con el decorador
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('permissions', [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay permisos definidos, permitimos el acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no enviado o inválido');
    }

    try {
      // Llamada HTTP POST al microservicio /can-do
      const response = await axios.post(
        'http://localhost:3000/can-do', // Cambiar por la URL real del microservicio
        { permissions: requiredPermissions },
        { headers: { Authorization: authHeader } },
      );

      // La respuesta debe contener { canDo: true/false }
      if (response.data && response.data.canDo === true) {
        return true;
      } else {
        throw new ForbiddenException('Permisos insuficientes');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new UnauthorizedException('Token inválido o expirado');
      }
      throw new ForbiddenException('Permisos insuficientes');
    }
  }
}
