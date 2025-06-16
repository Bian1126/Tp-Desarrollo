import { UserEntity } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  async createRole(name: string, permissionIds: number[]) {
    const permissions = permissionIds.map(id => ({ id })) as any;
    const role = this.roleRepo.create({ name, permissions });
    return this.roleRepo.save(role);
  }

  async assignRolesToUser(userId: number, roleIds: number[]) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['roles'] });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const roles = await this.roleRepo.find({
      where: roleIds.map(id => ({ id })),
    });

    if (roles.length !== roleIds.length) {
      throw new NotFoundException('Alguno de los roles no existe');
    }

    const roleIdsSet = new Set(user.roles.map(r => r.id));
    const newRoles = roles.filter(r => !roleIdsSet.has(r.id));

    user.roles = [...user.roles, ...newRoles];
    return this.userRepo.save(user);
  }
}
