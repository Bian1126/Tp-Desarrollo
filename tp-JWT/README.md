# Proyecto Usuarios con Roles y Permisos - API NestJS

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

Proyecto API REST construido con NestJS que maneja usuarios, roles y permisos, con autenticación JWT y control granular de acceso mediante guards personalizados.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## API Endpoints
- `POST /login`: Login de usuario.

- `POST /register`: Registro de usuario.

- `GET /me`: Datos del usuario autenticado (AuthGuard).

- `PATCH /assign-role/:userId/:roleName`: Asignar rol (AuthGuard + PermissionsGuard con permiso `assign_role`).

- `GET /users`: Listar usuarios con roles y permisos (AuthGuard + PermissionsGuard con permiso `users_list`).

- `GET /my-permissions`: Obtener permisos del usuario autenticado (AuthGuard + PermissionsGuard con permiso `view_permissions`).

## Requirements
- Node.js v18+

- Base de datos PostgreSQL configurada con TypeORM

- Variables de entorno en `.env` (JWT secret, DB connection, etc.)

## Security
- `AuthGuard` para validar token JWT y autenticar usuario.

- `PermissionsGuard` junto con el decorador `@Permissions()` para validar permisos necesarios por endpoint.
