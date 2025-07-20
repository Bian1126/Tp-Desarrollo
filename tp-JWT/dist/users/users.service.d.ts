import { Repository } from 'typeorm';
import { LoginDTO } from 'src/interfaces/login.dto';
import { RegisterDTO } from 'src/interfaces/register.dto';
import { UserEntity } from 'src/entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
export declare class UsersService {
    private jwtService;
    private readonly userRepo;
    constructor(jwtService: JwtService, userRepo: Repository<UserEntity>);
    assignRoleToUser(userId: number, roleName: string): Promise<{
        message: string;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    canDo(user: UserEntity, permission: string): Promise<boolean>;
    register(body: RegisterDTO): Promise<{
        status: string;
    }>;
    login(body: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    findByEmail(email: string): Promise<UserEntity>;
    getPermissions(user: UserEntity): Promise<string[]>;
    deleteByEmail(email: string): Promise<{
        status: string;
    }>;
    updateByEmail(email: string, data: {
        email?: string;
        password?: string;
    }): Promise<{
        status: string;
    }>;
}
