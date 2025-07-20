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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
const bcrypt_1 = require("bcrypt");
const jwt_service_1 = require("../jwt/jwt.service");
const role_entity_1 = require("../entities/role.entity");
const permission_entity_1 = require("../entities/permission.entity");
let UsersService = class UsersService {
    constructor(jwtService, userRepo) {
        this.jwtService = jwtService;
        this.userRepo = userRepo;
    }
    async assignRoleToUser(userId, roleName) {
        const user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['roles'],
        });
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', 404);
        }
        const roleRepo = this.userRepo.manager.getRepository(role_entity_1.Role);
        const role = await roleRepo.findOne({ where: { name: roleName }, relations: ['permissions'] });
        if (!role) {
            throw new common_1.HttpException('Rol no encontrado', 404);
        }
        if (user.roles.some(r => r.id === role.id)) {
            return { message: 'Usuario ya tiene ese rol asignado' };
        }
        user.roles.push(role);
        await this.userRepo.save(user);
        return { message: `Rol '${roleName}' asignado al usuario ${user.email}` };
    }
    async refreshToken(refreshToken) {
        return this.jwtService.refreshToken(refreshToken);
    }
    async canDo(user, permission) {
        const permissionCodes = await this.getPermissions(user);
        const result = permissionCodes.includes(permission);
        if (!result) {
            throw new common_1.UnauthorizedException('No tienes permiso para realizar esta acción');
        }
        return true;
    }
    async register(body) {
        try {
            const user = new user_entity_1.UserEntity();
            Object.assign(user, body);
            user.password = (0, bcrypt_1.hashSync)(user.password, 10);
            const usersCount = await this.userRepo.count();
            const roleRepo = this.userRepo.manager.getRepository(role_entity_1.Role);
            const permissionRepo = this.userRepo.manager.getRepository(permission_entity_1.Permission);
            if (usersCount === 0) {
                let adminRole = await roleRepo.findOne({ where: { name: 'admin' }, relations: ['permissions'] });
                if (!adminRole) {
                    adminRole = roleRepo.create({ name: 'admin' });
                    adminRole.permissions = [];
                    const permissions = [
                        'ver_personas', 'ver_persona', 'crear_persona', 'editar_persona', 'eliminar_persona',
                        'ver_ciudades', 'ver_ciudad', 'crear_ciudad', 'editar_ciudad', 'eliminar_ciudad',
                        'ver_provincias', 'ver_provincia', 'crear_provincia', 'editar_provincia', 'eliminar_provincia',
                        'ver_paises', 'ver_pais', 'crear_pais', 'editar_pais', 'eliminar_pais',
                        'users_list', 'assign_role'
                    ];
                    for (const permName of permissions) {
                        let perm = await permissionRepo.findOne({ where: { name: permName } });
                        if (!perm) {
                            perm = permissionRepo.create({ name: permName });
                            await permissionRepo.save(perm);
                        }
                        adminRole.permissions.push(perm);
                    }
                    await roleRepo.save(adminRole);
                }
                user.roles = [adminRole];
            }
            else {
                let userRole = await roleRepo.findOne({ where: { name: 'user' }, relations: ['permissions'] });
                if (!userRole) {
                    userRole = roleRepo.create({ name: 'user' });
                    userRole.permissions = [];
                    const permissions = ['ver_personas'];
                    for (const permName of permissions) {
                        let perm = await permissionRepo.findOne({ where: { name: permName } });
                        if (!perm) {
                            perm = permissionRepo.create({ name: permName });
                            await permissionRepo.save(perm);
                        }
                        userRole.permissions.push(perm);
                    }
                    await roleRepo.save(userRole);
                }
                user.roles = [userRole];
            }
            await this.userRepo.save(user);
            return { status: 'created' };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error de creación', 500);
        }
    }
    async login(body) {
        const user = await this.findByEmail(body.email);
        if (!user)
            throw new common_1.UnauthorizedException();
        const compareResult = (0, bcrypt_1.compareSync)(body.password, user.password);
        if (!compareResult)
            throw new common_1.UnauthorizedException();
        return {
            accessToken: this.jwtService.generateToken({ id: user.id, email: user.email }, 'auth'),
            refreshToken: this.jwtService.generateToken({ id: user.id, email: user.email }, 'refresh'),
        };
    }
    async findByEmail(email) {
        return this.userRepo.findOneBy({ email });
    }
    async getPermissions(user) {
        console.log('Usuario recibido en getPermissions:', user);
        const userWithRoles = await this.userRepo.findOne({
            where: { id: user.id },
            relations: ['roles', 'roles.permissions'],
        });
        if (!userWithRoles) {
            console.log('Usuario no encontrado');
            throw new common_1.UnauthorizedException('Usuario no encontrado');
        }
        const permissions = new Set();
        for (const role of userWithRoles.roles) {
            for (const perm of role.permissions) {
                permissions.add(perm.name);
            }
        }
        const permsArray = Array.from(permissions);
        console.log('Permisos encontrados:', permsArray);
        return permsArray;
    }
    async deleteByEmail(email) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user)
            throw new common_1.HttpException('Usuario no encontrado', 404);
        await this.userRepo.remove(user);
        return { status: 'deleted' };
    }
    async updateByEmail(email, data) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user)
            throw new common_1.HttpException('Usuario no encontrado', 404);
        if (data.email)
            user.email = data.email;
        if (data.password)
            user.password = (0, bcrypt_1.hashSync)(data.password, 10);
        await this.userRepo.save(user);
        return { status: 'updated' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [jwt_service_1.JwtService,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map