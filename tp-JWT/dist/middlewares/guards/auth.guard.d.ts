import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
export declare class AuthGuard implements CanActivate {
    private jwtService;
    private userRepository;
    constructor(jwtService: JwtService, userRepository: Repository<UserEntity>);
    private extractTokenFromHeader;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
