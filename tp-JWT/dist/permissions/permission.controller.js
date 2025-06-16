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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const permission_service_1 = require("./permission.service");
const auth_guard_1 = require("../middlewares/guards/auth.guard");
const permissions_guard_1 = require("../middlewares/guards/permissions.guard");
const permissions_decorator_1 = require("../middlewares/decorators/permissions.decorator");
let PermissionsController = class PermissionsController {
    constructor(service) {
        this.service = service;
    }
    getMyPermissions(req) {
        console.log('Usuario recibido en /permissions/my-permissions:', req.user);
        return this.service.getPermissions(req.user);
    }
    create(body) {
        return this.service.createPermission(body.name);
    }
    findAll() {
        return this.service.findAll();
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('my-permissions'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getMyPermissions", null);
__decorate([
    (0, common_1.Post)(),
    (0, permissions_decorator_1.Permissions)('permission_create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, permissions_decorator_1.Permissions)('permission_list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "findAll", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionsGuard, auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [permission_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permission.controller.js.map