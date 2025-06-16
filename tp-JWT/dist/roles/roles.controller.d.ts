import { RolesService } from './roles.service';
export declare class RolesController {
    private readonly service;
    constructor(service: RolesService);
    create(body: {
        name: string;
        permissionIds: number[];
    }): Promise<import("../entities/role.entity").Role>;
    assignRoleToUser(userId: number, body: {
        roleIds: number[];
    }): Promise<import("../entities/user.entity").UserEntity>;
}
