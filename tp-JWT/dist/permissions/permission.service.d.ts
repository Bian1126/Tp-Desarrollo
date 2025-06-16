import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { UserEntity } from 'src/entities/user.entity';
export declare class PermissionsService {
    private readonly permissionRepo;
    private readonly userRepo;
    constructor(permissionRepo: Repository<Permission>, userRepo: Repository<UserEntity>);
    getPermissions(user: UserEntity): Promise<string[]>;
    createPermission(name: string): Promise<Permission>;
    findAll(): Promise<Permission[]>;
}
