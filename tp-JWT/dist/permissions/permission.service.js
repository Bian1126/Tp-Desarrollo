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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("../entities/permission.entity");
const user_entity_1 = require("../entities/user.entity");
let PermissionsService = class PermissionsService {
    constructor(permissionRepo, userRepo) {
        this.permissionRepo = permissionRepo;
        this.userRepo = userRepo;
    }
    async getPermissions(user) {
        if (!user || !user.email) {
            throw new common_1.UnauthorizedException('Usuario no autenticado');
        }
        const userWithRoles = await this.userRepo.findOne({
            where: { email: user.email },
            relations: ['roles', 'roles.permissions'],
        });
        if (!userWithRoles) {
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const permissions = new Set();
        for (const role of userWithRoles.roles) {
            for (const perm of role.permissions) {
                permissions.add(perm.name);
            }
        }
        return Array.from(permissions);
    }
    async createPermission(name) {
        const permission = this.permissionRepo.create({ name });
        return this.permissionRepo.save(permission);
    }
    async findAll() {
        return this.permissionRepo.find();
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PermissionsService);
//# sourceMappingURL=permission.service.js.map