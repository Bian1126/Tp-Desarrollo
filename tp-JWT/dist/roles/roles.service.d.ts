import { UserEntity } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
export declare class RolesService {
    private roleRepo;
    private userRepo;
    constructor(roleRepo: Repository<Role>, userRepo: Repository<UserEntity>);
    createRole(name: string, permissionIds: number[]): Promise<Role>;
    assignRolesToUser(userId: number, roleIds: number[]): Promise<UserEntity>;
}
