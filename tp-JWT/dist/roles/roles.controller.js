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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const roles_service_1 = require("./roles.service");
const permissions_decorator_1 = require("../middlewares/decorators/permissions.decorator");
const auth_guard_1 = require("../middlewares/guards/auth.guard");
const permissions_guard_1 = require("../middlewares/guards/permissions.guard");
let RolesController = class RolesController {
    constructor(service) {
        this.service = service;
    }
    create(body) {
        return this.service.createRole(body.name, body.permissionIds);
    }
    async assignRoleToUser(userId, body) {
        return this.service.assignRolesToUser(userId, body.roleIds);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('roles_create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/assign'),
    (0, permissions_decorator_1.Permissions)('roles_assign'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignRoleToUser", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)('roles'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map