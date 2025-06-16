import { RequestWithUser } from './interfaces/request-user';
export declare class AppController {
    constructor();
    getHello(): string;
    canDo(request: RequestWithUser, permissions: string[]): Promise<{
        canDo: boolean;
    }>;
}
