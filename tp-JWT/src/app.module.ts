import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { AppController } from './app.controller';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthGuard } from './middlewares/guards/auth.guard';
import { JwtService } from './jwt/jwt.service';
import { PermissionsController } from './permissions/permission.controller';
import { PermissionsService } from './permissions/permission.service';
import { RolesController } from './roles/roles.controller';
import { RolesService } from './roles/roles.service';
import { PermissionsGuard } from './middlewares/guards/permissions.guard';
import { UserEntity } from './entities/user.entity';
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',        // Cambiá según tu configuración
      port: 5433,               // Puerto por defecto de Postgres
      username: 'postgres',   // Poné tu usuario de Postgres
      password: 'bp21012021',  // Poné tu contraseña
      database: 'mybd_desarrollo_bian_persona',      // Poné el nombre de tu base de datos
      entities: [UserEntity, Role, Permission],
      synchronize: true,
    }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [
    AppController,
    UsersController,
    PermissionsController,
    RolesController,
  ],
  providers: [
    AuthGuard,
    JwtService,
    UsersService,
    PermissionsService,
    RolesService,PermissionsGuard
  ],
})
export class AppModule {}