"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_service_1 = require("../../jwt/jwt.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
let AuthGuard = class AuthGuard {
    constructor(jwtService, userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }
    extractTokenFromHeader(authHeader) {
        if (!authHeader)
            throw new common_1.UnauthorizedException('No token provided');
        if (!authHeader.toLowerCase().startsWith('bearer '))
            throw new common_1.UnauthorizedException('Invalid token format');
        return authHeader.slice(7);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        const token = this.extractTokenFromHeader(authHeader);
        try {
            const payload = this.jwtService.getPayload(token, 'auth');
            if (!payload.email) {
                throw new common_1.UnauthorizedException('Token payload missing email');
            }
            const user = await this.userRepository.findOne({
                where: { email: payload.email },
                relations: ['roles', 'roles.permissions'],
            });
            if (!user)
                throw new common_1.UnauthorizedException('User not found');
            request.user = user;
            return true;
        }
        catch (error) {
            throw new common_1.UnauthorizedException(`Invalid token: ${error.message}`);
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [jwt_service_1.JwtService,
        typeorm_2.Repository])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map