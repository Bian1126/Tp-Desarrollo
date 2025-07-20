-- para ver los roles de un usuario 
SELECT * FROM "users_roles_role" WHERE "usersId" = 18; -- el id del usario al que le queremos ver el rol


-- ver que permisos tiene ese rol
SELECT * FROM "roles_permissions_permission" WHERE "rolesId" = 1; -- el id del rol al que le queremos ver los permisos

-- asignar un rol a un usuario
await usersService.assignRoleToUser(18, 'admin');

-- Eliminar relaciones
DELETE FROM role_permissions_permission;
DELETE FROM users_roles_role;
DELETE FROM role;
DELETE FROM permissions;

-- Eliminar usuarios
DELETE FROM users;

-- (Opcional) Eliminar personas
DELETE FROM person;

-- Reiniciar secuencias
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE person_id_seq RESTART WITH 1;
ALTER SEQUENCE role_id_seq RESTART WITH 1;
ALTER SEQUENCE permissions_id_seq RESTART WITH 1;

-- 1. Crear el rol admin si no existe
INSERT INTO role (id, name)
SELECT 1, 'admin'
WHERE NOT EXISTS (SELECT 1 FROM role WHERE name = 'admin');

-- 2. Crear permisos si no existen (agregá todos los que uses)
INSERT INTO permissions (id, name) VALUES
  (23, 'ver_personas'),
  (24, 'ver_persona'),
  (25, 'crear_persona'),
  (26, 'editar_persona'),
  (27, 'eliminar_persona'),
  (28, 'ver_ciudades'),
  (29, 'ver_ciudad'),
  (30, 'crear_ciudad'),
  (31, 'editar_ciudad'),
  (32, 'eliminar_ciudad'),
  (33, 'ver_provincias'),
  (34, 'ver_provincia'),
  (35, 'crear_provincia')
ON CONFLICT (id) DO NOTHING;

-- 3. Asignar todos los permisos al rol admin (id=1)
INSERT INTO role_permissions_permission ("roleId", "permissionId")
SELECT 1, id FROM permissions
WHERE NOT EXISTS (
  SELECT 1 FROM role_permissions_permission rpp
  WHERE rpp."roleId" = 1 AND rpp."permissionId" = permissions.id
);

-- 4. Asignar el rol admin al usuario admin (ajustá el id si es necesario)
-- Supongamos que tu usuario admin tiene id=1
INSERT INTO users_roles_role ("usersId", "roleId")
SELECT 1, 1
WHERE NOT EXISTS (
  SELECT 1 FROM users_roles_role WHERE "usersId" = 1 AND "roleId" = 1
);