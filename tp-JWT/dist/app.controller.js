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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const permissions_decorator_1 = require("./middlewares/decorators/permissions.decorator");
const permissions_guard_1 = require("./middlewares/guards/permissions.guard");
const auth_guard_1 = require("./middlewares/guards/auth.guard");
let AppController = class AppController {
    constructor() { }
    getHello() {
        return 'status:OK';
    }
    async canDo(request, permissions) {
        console.log('Usuario recibido:', request.user);
        console.log('Permisos solicitados:', permissions);
        const user = request.user;
        try {
            const canDo = permissions.every(p => user.permissionCodes.includes(p));
            return { canDo };
        }
        catch (error) {
            console.error('Error en / can-do:', error);
            throw error;
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.Permissions)('view_status'),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)('can-do'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('permissions')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "canDo", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [])
], AppController);
//# sourceMappingURL=app.controller.js.map