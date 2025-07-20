import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDTO } from 'src/interfaces/login.dto';
import { RegisterDTO } from 'src/interfaces/register.dto';
import { UserI } from 'src/interfaces/user.interface';
import { UserEntity } from 'src/entities/user.entity';
import { hashSync, compareSync } from 'bcrypt';
import { JwtService } from 'src/jwt/jwt.service';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async assignRoleToUser(userId: number, roleName: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
    if (!user) {
      throw new HttpException('Usuario no encontrado', 404);
    }

    const roleRepo = this.userRepo.manager.getRepository(Role);
    const role = await roleRepo.findOne({ where: { name: roleName }, relations: ['permissions'] });
    if (!role) {
      throw new HttpException('Rol no encontrado', 404);
    }

    // Evitar duplicados
    if (user.roles.some(r => r.id === role.id)) {
      return { message: 'Usuario ya tiene ese rol asignado' };
    }

    user.roles.push(role);
    await this.userRepo.save(user);
    return { message: `Rol '${roleName}' asignado al usuario ${user.email}` };
  }

  async refreshToken(refreshToken: string) {
    return this.jwtService.refreshToken(refreshToken);
  }

  async canDo(user: UserEntity, permission: string): Promise<boolean> {
    const permissionCodes = await this.getPermissions(user);

    const result = permissionCodes.includes(permission);
    if (!result) {
      throw new UnauthorizedException('No tienes permiso para realizar esta acción');
    }
    return true;
  }

  async register(body: RegisterDTO) {
    try {
      const user = new UserEntity();
      Object.assign(user, body);
      user.password = hashSync(user.password, 10);

      const usersCount = await this.userRepo.count();
      const roleRepo = this.userRepo.manager.getRepository(Role);
      const permissionRepo = this.userRepo.manager.getRepository(Permission);

      if (usersCount === 0) {
        // Primer usuario: rol admin con todos los permisos
        let adminRole = await roleRepo.findOne({ where: { name: 'admin' }, relations: ['permissions'] });
        if (!adminRole) {
          adminRole = roleRepo.create({ name: 'admin' });
          adminRole.permissions = [];
          const permissions = [
            // Personas
            'ver_personas', 'ver_persona', 'crear_persona', 'editar_persona', 'eliminar_persona',
            // Ciudades
            'ver_ciudades', 'ver_ciudad', 'crear_ciudad', 'editar_ciudad', 'eliminar_ciudad',
            // Provincias
            'ver_provincias', 'ver_provincia', 'crear_provincia', 'editar_provincia', 'eliminar_provincia',
            // Países
            'ver_paises', 'ver_pais', 'crear_pais', 'editar_pais', 'eliminar_pais',
            // Administración
            'users_list', 'assign_role'
          ];
          for (const permName of permissions) {
            let perm = await permissionRepo.findOne({ where: { name: permName } });
            if (!perm) {
              perm = permissionRepo.create({ name: permName });
              await permissionRepo.save(perm);
            }
            adminRole.permissions.push(perm);
          }
          await roleRepo.save(adminRole);
        }
        user.roles = [adminRole];
      } else {
        // Usuarios siguientes: rol user con permisos básicos
        let userRole = await roleRepo.findOne({ where: { name: 'user' }, relations: ['permissions'] });
        if (!userRole) {
          userRole = roleRepo.create({ name: 'user' });
          userRole.permissions = [];
          const permissions = ['ver_personas'];
          
          for (const permName of permissions) {
            let perm = await permissionRepo.findOne({ where: { name: permName } });
            if (!perm) {
              perm = permissionRepo.create({ name: permName });
              await permissionRepo.save(perm);
            }
            userRole.permissions.push(perm);
          }
          await roleRepo.save(userRole);
        }
        user.roles = [userRole];
      }

      await this.userRepo.save(user);
      return { status: 'created' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error de creación', 500);
    }
  }

  async login(body: LoginDTO) {
    const user = await this.findByEmail(body.email);
    if (!user) throw new UnauthorizedException();

    const compareResult = compareSync(body.password, user.password);
    if (!compareResult) throw new UnauthorizedException();

    return {
      accessToken: this.jwtService.generateToken({ id: user.id, email: user.email }, 'auth'),
      refreshToken: this.jwtService.generateToken({ id: user.id, email: user.email }, 'refresh'),
    };
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepo.findOneBy({ email });
  }

  async getPermissions(user: UserEntity): Promise<string[]> {
    console.log('Usuario recibido en getPermissions:', user);

    const userWithRoles = await this.userRepo.findOne({
      where: { id: user.id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!userWithRoles) {
      console.log('Usuario no encontrado');
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const permissions = new Set<string>();
    for (const role of userWithRoles.roles) {
      for (const perm of role.permissions) {
        permissions.add(perm.name);
      }
    }

    const permsArray = Array.from(permissions);
    console.log('Permisos encontrados:', permsArray);

    return permsArray;
  }

  //Esto es lo nuevo
    async deleteByEmail(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new HttpException('Usuario no encontrado', 404);
    await this.userRepo.remove(user);
    return { status: 'deleted' };
  }
  
  async updateByEmail(email: string, data: { email?: string, password?: string }) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new HttpException('Usuario no encontrado', 404);
    if (data.email) user.email = data.email;
    if (data.password) user.password = hashSync(data.password, 10);
        await this.userRepo.save(user);
        return { status: 'updated' };
      }

}