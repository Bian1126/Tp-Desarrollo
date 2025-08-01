"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const app_controller_1 = require("./app.controller");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
const auth_guard_1 = require("./middlewares/guards/auth.guard");
const jwt_service_1 = require("./jwt/jwt.service");
const permission_controller_1 = require("./permissions/permission.controller");
const permission_service_1 = require("./permissions/permission.service");
const roles_controller_1 = require("./roles/roles.controller");
const roles_service_1 = require("./roles/roles.service");
const permissions_guard_1 = require("./middlewares/guards/permissions.guard");
const user_entity_1 = require("./entities/user.entity");
const permission_entity_1 = require("./entities/permission.entity");
const role_entity_1 = require("./entities/role.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5433,
                username: 'postgres',
                password: 'bp21012021',
                database: 'mybd_persona',
                entities: [user_entity_1.UserEntity, role_entity_1.Role, permission_entity_1.Permission],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forFeature(entities_1.entities),
        ],
        controllers: [
            app_controller_1.AppController,
            users_controller_1.UsersController,
            permission_controller_1.PermissionsController,
            roles_controller_1.RolesController,
        ],
        providers: [
            auth_guard_1.AuthGuard,
            jwt_service_1.JwtService,
            users_service_1.UsersService,
            permission_service_1.PermissionsService,
            roles_service_1.RolesService, permissions_guard_1.PermissionsGuard
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map