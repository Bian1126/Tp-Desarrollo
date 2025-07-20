# SiBiGo - Proyecto de Desarrollo de Software

## Tabla de Contenidos

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Microservicios](#microservicios)

   * [Microservicio JWT](#microservicio-jwt)
   * [Microservicio Principal (tp-persona)](#microservicio-principal-tp-persona)
3. [Proyecto Angular](#proyecto-angular)
4. [Servicios y Componentes en Angular](#servicios-y-componentes-en-angular)
5. [Otros Archivos y Organización](#otros-archivos-y-organizacion)
6. [Middlewares](#middlewares)
7. [Conexión con el Backend](#conexion-con-el-backend)
8. [Resumen](#resumen)
9. [Guía Rápida para la Revisión](#guia-rapida-para-la-revision)

---

## Estructura del Proyecto

El proyecto está organizado de forma modular, separando claramente el frontend (Angular) y los microservicios (backend). Esto mejora la mantenibilidad, la escalabilidad y la separación de responsabilidades.

```
/Tp-Desarrollo
|
├── SiBiGo/                        # Proyecto Angular (frontend)
│   ├── src/app/pages/             # Páginas y componentes Angular
│   ├── src/app/services/          # Servicios Angular reutilizables
│   ├── src/app/config/            # Configuración global (env.ts)
│   ├── src/app/interfaces/        # Interfaces TypeScript para tipado de datos
│   ├── src/app/app.routes.ts      # Archivo de rutas Angular
│   ├── src/assets/                # Imágenes y recursos
│   └── ...                        # Otros archivos Angular
|
├── tp-persona/                    # Microservicio principal (gestión de personas y ciudades)
│   ├── src/person/                # Controlador y servicio de personas
│   ├── src/city/                  # Controlador y servicio de ciudades
│   └── ...                        # Configuración y otros módulos
|
├── tp-jwt/                        # Microservicio de autenticación JWT
│   └── ...                        # Código de autenticación y generación de tokens
|
├── docker-compose.yml             # Archivo para levantar todos los servicios si se usa Docker
└── README.md                      # Documentación general del proyecto
```

---

## Microservicios

### Microservicio JWT

* **Ubicación:** `tp-jwt`
* **Función principal:** Autenticación de usuarios.
* **¿Qué hace?** Recibe credenciales de usuario (usuario y contraseña) y, si son válidas, genera un token JWT. Este token se usa para acceder a rutas protegidas de otros microservicios.
* **Endpoints importantes:**

  * `POST /login`: Valida credenciales y devuelve un token JWT.
* **Middleware:** Este microservicio incluye una función que valida el token. Si no es válido o falta, la petición es rechazada (status 401).

### Microservicio Principal (tp-persona)

* **Ubicación:** `tp-persona`
* **Función principal:** Manejo de entidades como Personas y Ciudades.
* **Endpoints de personas:**

  * `GET /person`: Lista todas las personas (requiere token).
  * `GET /person/:id`: Devuelve los datos de una persona específica.
  * `POST /person`: Crea una nueva persona.
  * `PATCH /person/:id`: Edita los datos de una persona.
  * `DELETE /person/:id`: Elimina una persona.
  * `POST /person/public`: Permite el registro público sin autenticación.
* **Endpoints de ciudades:**

  * `GET /city/public`: Lista de ciudades sin necesidad de token.
  * `GET /city`: Lista de ciudades protegida (requiere token).
* **Seguridad:** Las rutas que modifican o acceden a información sensible requieren autenticación mediante JWT.

---

## Proyecto Angular

* **Ubicación:** `SiBiGo`
* **Funcionalidad:** Es la interfaz web con la que interactúa el usuario. Permite realizar operaciones como autenticación, registro de personas, edición, visualización y eliminación de datos.

**Características principales:**

* Interfaz clara y fácil de usar.
* Formularios con validaciones.
* Login de usuarios y almacenamiento del token en `localStorage`.
* Navegación entre pantallas mediante rutas.
* Conexión con el backend utilizando servicios Angular.

Pantallas implementadas:

* Login
* Registro público
* Agregar persona (requiere login)
* Editar persona
* Ver detalle de persona
* Listado de personas

---

## Servicios y Componentes en Angular

### Servicios (`src/app/services/`)

Los servicios encapsulan la lógica de negocio y las llamadas HTTP al backend. Esto permite reutilizar código y mantener la lógica separada del componente visual.

* **person.ts:** Realiza las operaciones CRUD sobre personas, tanto privadas como públicas.
* **city.ts:** Obtiene ciudades del backend, tanto con como sin autenticación.
* **auth.service.ts:** Se encarga del login y de guardar el token en `localStorage`.
* **global-status.service.ts:** Controla estados globales como si hay una operación en progreso.
* **api.service.ts:** Servicio de ejemplo para llamar a una API externa (alimentos).

### Componentes principales (`src/app/pages/`)

Cada componente corresponde a una pantalla del sistema. Ellos consumen los servicios para obtener o enviar datos:

* **add-person / edit-person:** Formulario de carga y edición de persona. Selección de ciudad mediante combo.
* **person-list / person-view:** Listado y detalle de personas.
* **register-person:** Registro público sin autenticación.
* **login:** Pantalla de acceso al sistema.

---

## Otros Archivos y Organización

### Configuración (`src/app/config/env.ts`)

Contiene valores reutilizables como URLs de APIs externas.

```ts
export const config = {
  urls: {
    getFood: 'https://run.mocky.io/v3/0a5a1d85-ee02-455e-b53e-e3887acfbfaf',
  },
};
```

### Interfaces (`src/app/interfaces/`)

Define la estructura de datos que se usa en todo el proyecto (Person, City, etc.), mejorando la seguridad y mantenimiento del código.

### Rutas (`src/app/app.routes.ts`)

Este archivo define la navegación interna del frontend. Cada ruta lleva a un componente:

```ts
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'person-list', component: PersonListComponent },
  { path: 'person-view/:id', component: PersonViewComponent },
  { path: 'edit-person/:id', component: EditPerson },
  { path: 'register-person', component: RegisterPerson },
  { path: 'add-person', component: AddPerson },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
```

---

## Middlewares

### JWT Middleware

* Se encarga de validar el token en las rutas protegidas.
* Si el token está ausente o es inválido, devuelve un error 401.
* Este middleware se aplica en los microservicios `tp-jwt` y `tp-persona`.

### Otros Middlewares

* **Logs:** Permite registrar información útil de cada petición para debug o auditoría.
* **Manejo de errores:** Devuelve errores claros y amigables al frontend si ocurre alguna excepción.

---

## Conexión con el Backend

El frontend Angular se comunica con los microservicios usando `axios`, una librería para realizar peticiones HTTP.

**Flujo básico:**

1. El usuario inicia sesión y se llama al endpoint `POST /login`.
2. El backend devuelve un token JWT si las credenciales son correctas.
3. El token se guarda en `localStorage`.
4. Las siguientes peticiones a rutas protegidas se realizan enviando el token en el header:

```ts
headers: { Authorization: `Bearer ${token}` }
```

### Ejemplo de llamada a API con token:

```ts
async updatePerson(id: string, data: any, token: string) {
  return await axios.patch(
    `http://localhost:3001/person/${id}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}
```

---

## Resumen

* ✅ **Separación clara:** Angular (frontend) + microservicios (backend)
* 🔐 **Autenticación robusta:** JWT implementado para proteger rutas sensibles
* ⚙️ **Middlewares:** Validación de tokens, manejo de errores y logs
* 🔗 **Conexión frontend-backend:** Angular consume servicios con headers protegidos
* 💡 **Código limpio y escalable:** Arquitectura basada en componentes y servicios

---

## Guía Rápida para la Revisión

* **Estructura del proyecto:** Mostrar árbol de carpetas en VS Code
* **Microservicio JWT:** Mostrar `auth.controller.ts`, `auth.service.ts`, middleware
* **Microservicio de personas:** Mostrar `person.controller.ts`, `city.controller.ts`, middleware JWT
* **Frontend Angular:**

  * Mostrar componentes en `src/app/pages/`
  * Mostrar servicios en `src/app/services/`
  * Mostrar rutas en `src/app/app.routes.ts`
  * Mostrar archivos `config` e `interfaces`
* **Conexión:** Mostrar cómo se usa el token para consumir endpoints protegidos

---

**Nota final:**
El proyecto sigue las mejores prácticas de Angular y microservicios, promoviendo modularidad, seguridad y facilidad de mantenimiento.

Estamos abiertos a sugerencias del profesor para seguir mejorando.
