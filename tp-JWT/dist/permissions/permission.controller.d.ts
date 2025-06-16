import { PermissionsService } from './permission.service';
import { RequestWithUser } from 'src/interfaces/request-user';
export declare class PermissionsController {
    private readonly service;
    constructor(service: PermissionsService);
    getMyPermissions(req: RequestWithUser): Promise<string[]>;
    create(body: {
        name: string;
    }): Promise<import("../entities/permission.entity").Permission>;
    findAll(): Promise<import("../entities/permission.entity").Permission[]>;
}
