import { BaseEntity } from 'typeorm';
import { Role } from './role.entity';
import { UserI } from '../interfaces/user.interface';
export declare class UserEntity extends BaseEntity implements UserI {
    id: number;
    email: string;
    password: string;
    roles: Role[];
    get permissionCodes(): string[];
}
