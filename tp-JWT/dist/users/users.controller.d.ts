import { UsersService } from './users.service';
import { LoginDTO } from '../interfaces/login.dto';
import { RegisterDTO } from '../interfaces/register.dto';
import { Request } from 'express';
import { RequestWithUser } from 'src/interfaces/request-user';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
export declare class UsersController {
    private service;
    private readonly userRepo;
    constructor(service: UsersService, userRepo: Repository<UserEntity>);
    assignRole(userId: string, roleName: string, req: RequestWithUser): Promise<{
        message: string;
    }>;
    me(req: RequestWithUser): {
        email: string;
    };
    login(body: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    publicRegister(body: RegisterDTO): Promise<{
        status: string;
    }>;
    register(body: RegisterDTO, req: RequestWithUser): Promise<{
        status: string;
    }>;
    canDo(request: RequestWithUser, permissions: string[]): Promise<{
        canDo: boolean;
    }>;
    refreshToken(request: Request): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    findAllUsers(): Promise<UserEntity[]>;
    getMyPermissions(req: RequestWithUser): Promise<string[]>;
    deleteUser(email: string): Promise<{
        status: string;
    }>;
    updateUser(email: string, data: {
        email?: string;
        password?: string;
    }): Promise<{
        status: string;
    }>;
}
