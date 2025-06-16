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
exports.RolesService = void 0;
const user_entity_1 = require("../entities/user.entity");
const role_entity_1 = require("../entities/role.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let RolesService = class RolesService {
    constructor(roleRepo, userRepo) {
        this.roleRepo = roleRepo;
        this.userRepo = userRepo;
    }
    async createRole(name, permissionIds) {
        const permissions = permissionIds.map(id => ({ id }));
        const role = this.roleRepo.create({ name, permissions });
        return this.roleRepo.save(role);
    }
    async assignRolesToUser(userId, roleIds) {
        const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['roles'] });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const roles = await this.roleRepo.find({
            where: roleIds.map(id => ({ id })),
        });
        if (roles.length !== roleIds.length) {
            throw new common_1.NotFoundException('Alguno de los roles no existe');
        }
        const roleIdsSet = new Set(user.roles.map(r => r.id));
        const newRoles = roles.filter(r => !roleIdsSet.has(r.id));
        user.roles = [...user.roles, ...newRoles];
        return this.userRepo.save(user);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
//# sourceMappingURL=roles.service.js.map