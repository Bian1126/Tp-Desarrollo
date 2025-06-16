import { Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,  // <--- Inyectar aquí el repositorio de UserEntity
  ) {}
  async getPermissions(user: UserEntity): Promise<string[]> {
    if (!user || !user.email) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    
  const userWithRoles = await this.userRepo.findOne({
    where: { email: user.email },
    relations: ['roles', 'roles.permissions'],
  });
  if (!userWithRoles) {
    throw new UnauthorizedException('Usuario no encontrado');
  }
  
  const permissions = new Set<string>();
  for (const role of userWithRoles.roles) {
    for (const perm of role.permissions) {
      permissions.add(perm.name);
    }
  }
  return Array.from(permissions);
  }

  async createPermission(name: string) {
    const permission = this.permissionRepo.create({ name });
    return this.permissionRepo.save(permission);
  }

  async findAll() {
    return this.permissionRepo.find();
  }
}
