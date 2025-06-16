import { Permission } from './permission.entity';
import { UserEntity } from './user.entity';
export declare class Role {
    id: number;
    name: string;
    permissions: Permission[];
    users: UserEntity[];
}
