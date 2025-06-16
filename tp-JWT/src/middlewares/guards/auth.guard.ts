import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { RequestWithUser } from 'src/interfaces/request-user';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  private extractTokenFromHeader(authHeader: string): string {
    if (!authHeader) throw new UnauthorizedException('No token provided');
    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new UnauthorizedException('Invalid token format');
    return authHeader.slice(7);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = request.headers['authorization'];
    const token = this.extractTokenFromHeader(authHeader);

    try {
  const payload = this.jwtService.getPayload(token, 'auth');
  if (!payload.email) {
    throw new UnauthorizedException('Token payload missing email');
  }
  // Buscar usuario
  const user = await this.userRepository.findOne({
    where: { email: payload.email },
    relations: ['roles', 'roles.permissions'],
  });
  if (!user) throw new UnauthorizedException('User not found');
  request.user = user;
  return true;
 }catch (error) {
  throw new UnauthorizedException(`Invalid token: ${error.message}`);
 }
  }
}