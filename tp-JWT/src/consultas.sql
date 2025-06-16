-- para ver los roles de un usuario 
SELECT * FROM "users_roles_role" WHERE "usersId" = 18; -- el id del usario al que le queremos ver el rol


-- ver que permisos tiene ese rol
SELECT * FROM "roles_permissions_permission" WHERE "rolesId" = 1; -- el id del rol al que le queremos ver los permisos

-- asignar un rol a un usuario
await usersService.assignRoleToUser(18, 'admin');
-- borrar los usarios y relaciones
DELETE FROM users_roles_role;
DELETE FROM users;
-- reiniciar los ids
SELECT pg_get_serial_sequence('users', 'id');
ALTER SEQUENCE public.users_id_seq RESTART WITH 1;

--Borrar roles y permissios si quiero empezar completamente de 0 
DELETE FROM role_permissions_permission;
DELETE FROM role;
DELETE FROM permissions;