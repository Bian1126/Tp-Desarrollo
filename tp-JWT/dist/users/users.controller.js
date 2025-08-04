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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const login_dto_1 = require("../interfaces/login.dto");
const register_dto_1 = require("../interfaces/register.dto");
const auth_guard_1 = require("../middlewares/guards/auth.guard");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../entities/user.entity");
const typeorm_2 = require("typeorm");
const permissions_decorator_1 = require("../middlewares/decorators/permissions.decorator");
const permissions_guard_1 = require("../middlewares/guards/permissions.guard");
const common_2 = require("@nestjs/common");
let UsersController = class UsersController {
    constructor(service, userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }
    async assignRole(userId, roleName, req) {
        const userIdNum = parseInt(userId, 10);
        return this.service.assignRoleToUser(userIdNum, roleName);
    }
    me(req) {
        return {
            email: req.user.email,
        };
    }
    login(body) {
        return this.service.login(body);
    }
    async publicRegister(body) {
        return this.service.register(body);
    }
    async register(body, req) {
        return this.service.register(body);
    }
    async canDo(request, permissions) {
        const user = request.user;
        const canDo = permissions.every((permission) => this.service.canDo(user, permission));
        return { canDo };
    }
    refreshToken(request) {
        return this.service.refreshToken(request.headers['refresh-token']);
    }
    async findAllUsers() {
        return this.userRepo.find({ relations: ['roles', 'roles.permissions'] });
    }
    getMyPermissions(req) {
        return this.service.getPermissions(req.user);
    }
    async deleteUser(email) {
        return this.service.deleteByEmail(email);
    }
    async updateUser(email, data) {
        return this.service.updateByEmail(email, data);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('assign_role'),
    (0, common_1.Patch)('assign-role/:userId/:roleName'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('roleName')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "assignRole", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDTO]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('public-register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDTO]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "publicRegister", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDTO, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('can-do'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('permissions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "canDo", null);
__decorate([
    (0, common_1.Get)('refresh-token'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('users_list'),
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('my-permissions'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMyPermissions", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('eliminar_persona'),
    (0, common_2.Delete)('user/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('editar_persona'),
    (0, common_1.Patch)('user/:email'),
    __param(0, (0, common_1.Param)('email')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)(''),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        typeorm_2.Repository])
], UsersController);
//# sourceMappingURL=users.controller.js.map