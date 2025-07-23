# Instrucciones para ejecutar el proyecto Tp-Desarrollo

Este repositorio contiene tres carpetas principales:

- **tp-JWT**: Backend de autenticación, usuarios, roles y permisos (puerto 3000)
- **tp-persona**: Backend de gestión de personas, ciudades, provincias y países (puerto 3001)
- **SiBiGo**: Frontend Angular que consume ambos backends

---

## 1. Clonar el repositorio

Abre una terminal y ejecuta:

```
git clone https://github.com/Bian1126/Tp-Desarrollo.git
```

## 2. Ingresar a la carpeta deseada

Por ejemplo, para el backend de JWT:

```
cd Tp-Desarrollo/tp-JWT
```

Para el backend de persona:

```
cd Tp-Desarrollo/tp-persona
```

Para el frontend:

```
cd Tp-Desarrollo/SiBiGo
```

## 3. Instalar las dependencias

Ejecuta en cada carpeta:

```
npm install
```

## 4. Configurar la base de datos

Asegúrate de tener PostgreSQL corriendo y de configurar las variables de entorno (`.env`) en cada backend según corresponda.

## 5. Ejecutar cada proyecto

En los backends (`tp-JWT` y `tp-persona`):

```
npm run start
```
o
```
npm run start:dev
```

En el frontend (`SiBiGo`):

```
ng serve
```

---

## Endpoints principales de cada proyecto

### tp-JWT (http://localhost:3000)
- `POST /register` : Registrar usuario
- `POST /login` : Iniciar sesión
- `GET /me` : Obtener datos del usuario autenticado
- `GET /users` : Listar usuarios (admin)
- `PATCH /assign-role/:userId/:roleName` : Asignar rol a usuario (admin)
- `GET /my-permissions` : Ver permisos del usuario
- `POST /can-do` : Verificar permisos
- `DELETE /user/:email` : Eliminar usuario
- `PATCH /user/:email` : Editar usuario
- `GET /refresh-token` : Obtener nuevo token
- `GET /permissions` : Listar permisos
- `POST /permissions` : Crear permiso

### tp-persona (http://localhost:3001)
- `GET /person` : Listar personas (paginado)
- `GET /person/all` : Listar todas las personas (sin paginar)
- `GET /person/:id` : Obtener persona por ID
- `POST /person` : Crear persona
- `PATCH /person/:id` : Editar persona
- `DELETE /person/:id` : Eliminar persona
- `GET /person/public` : Listar personas públicas
- `POST /person/public` : Crear persona pública
- `GET /city` : Listar ciudades
- `GET /province` : Listar provincias
- `GET /country` : Listar países

### SiBiGo (Frontend Angular)
- Consume los endpoints de ambos backends.
- Las rutas principales se configuran en el archivo de rutas de Angular (`app-routing.module.ts`).

---

**Notas importantes:**

- No subas las carpetas `node_modules` ni `dist`, ya que se generan automáticamente.
- Si cambias la configuración de la base de datos, actualiza los archivos `.env`.
- Para dudas sobre endpoints, estructura o ejecución, consulta este README o pregunta al autor.

---