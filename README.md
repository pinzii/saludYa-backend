# SaludYa — Backend

API REST del sistema de gestión y agendamiento de citas médicas **SaludYa**.

---

## Descripción del proyecto

**SaludYa** es una aplicación web que digitaliza el proceso de agendamiento de citas médicas para clínicas y consultorios de pequeño y mediano tamaño en Colombia. Este repositorio contiene el **backend** de la aplicación, desarrollado con **NestJS 11**, que expone una API REST consumida por el frontend Angular.

- **Repositorio frontend:** https://github.com/KerlyVanesaSarrias/frontend-saludYa
- **API en producción (Render):** https://backend-saludya.onrender.com

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| NestJS | ^11.0.1 | Framework principal del backend |
| TypeScript | ^5.7.3 | Lenguaje de programación |
| TypeORM | ^0.3.28 | ORM — mapeo de entidades a PostgreSQL |
| PostgreSQL (`pg`) | ^8.20.0 | Base de datos relacional |
| `@nestjs/jwt` | ^11.0.2 | Generación y verificación de JWT |
| Passport + passport-jwt | ^0.7 / ^4.0.1 | Estrategia de autenticación con JWT |
| bcrypt | ^6.0.0 | Hash seguro de contraseñas |
| class-validator | ^0.15.1 | Validación de DTOs en pipes globales |
| class-transformer | ^0.5.1 | Transformación de objetos en DTOs |
| Jest | ^30.0.0 | Framework de pruebas unitarias |

---

## Arquitectura general del sistema

```
┌─────────────────────────────────────────────────────────────┐
│               BACKEND — NestJS 11 (API REST)                │
│                                                             │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │   AuthModule   │  │  UsersModule │  │AppointmentsModule│ │
│  │                │  │              │  │                 │ │
│  │ AuthController │  │UsersController  │AppointmentsCntrl│ │
│  │ POST /auth/    │  │POST /register│  │GET  /           │ │
│  │      login     │  │GET  /:id     │  │POST /           │ │
│  │                │  │PUT  /:id     │  │PUT  /:id        │ │
│  │ AuthService    │  │GET  /        │  │DELETE /:id      │ │
│  │ (bcrypt+JWT)   │  │              │  │                 │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│                                                             │
│  Prefijo global: /api  │  CORS: habilitado  │  Puerto: 3000 │
│  ValidationPipe global (class-validator)                    │
└─────────────────────────┬───────────────────────────────────┘
                          │ TypeORM (synchronize: true en dev)
                          ▼
             ┌────────────────────────┐
             │  PostgreSQL            │
             │  Tablas:               │
             │  • users               │
             │  • appointments        │
             └────────────────────────┘
```

### Estructura de carpetas

```
src/
├── app.module.ts              # Módulo raíz — configura TypeORM y registra módulos
├── main.ts                    # Bootstrap: CORS, prefijo global /api, puerto
├── auth/
│   └── auth/
│       ├── auth.controller.ts # POST /api/auth/login
│       └── auth.service.ts    # Valida credenciales con bcrypt, emite JWT
├── users/
│   ├── users.controller.ts    # POST /register, GET /, GET /:id, PUT /:id
│   ├── users.service.ts       # Lógica de negocio (hash de contraseña, duplicados)
│   ├── repositories/
│   │   └── users.repository.ts
│   ├── entities/
│   │   └── user.entity.ts     # Entidad TypeORM: id, nombre, email, rol, etc.
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
└── appointments/
    ├── appointments.controller.ts  # GET, POST, PUT /:id, DELETE /:id
    ├── appointments.service.ts     # CRUD sobre la tabla appointments
    ├── entities/
    │   └── appointment.entity.ts  # Entidad TypeORM: especialidad, fecha, hora, etc.
    └── dto/
        └── create-appointment.dto.ts
```

---

## Guía de instalación

### Prerrequisitos

- **Node.js** v18 o superior
- **npm** v9 o superior
- **PostgreSQL** v15 o superior instalado y en ejecución

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/KerlyVanesaSarrias/backend-saludYa.git
cd backend-saludYa
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Crear el archivo de variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_postgres
DB_DATABASE=salud_ya

# JWT
JWT_SECRET=clave_secreta_larga_y_segura_aqui
JWT_EXPIRES_IN=24h

# Puerto del servidor
PORT=3000
```

**4. Crear la base de datos**

```sql
-- En psql o cualquier cliente PostgreSQL:
CREATE DATABASE salud_ya;
```

> TypeORM creará las tablas automáticamente al iniciar el servidor gracias a `synchronize: true`.

---

## Instrucciones para ejecutar localmente

```bash
# Modo desarrollo con hot-reload
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

La API estará disponible en: **http://localhost:3000/api**

---

## Documentación de la API

Todos los endpoints usan el prefijo `/api` (configurado globalmente en `main.ts`).

### Autenticación — `POST /api/auth/login`

Autentica al usuario y retorna un JWT.

**Acceso:** Público

**Body:**
```json
{ "email": "usuario@ejemplo.com", "password": "contraseña123" }
```

**Respuesta 200:**
```json
{ "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Respuesta 401:** `{ "message": "Credenciales inválidas" }`

> El JWT incluye en su payload: `{ sub: id, email, rol }`

---

### Usuarios — `/api/users`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/api/users/register` | Registrar nuevo usuario | ❌ Público |
| GET | `/api/users` | Listar todos los usuarios | ❌ Público |
| GET | `/api/users/:id` | Obtener usuario por ID | ❌ Público |
| PUT | `/api/users/:id` | Actualizar datos del usuario | ❌ Público |

**Body para registro:**
```json
{
  "nombre": "Ana Gómez",
  "email": "ana@ejemplo.com",
  "password": "contraseña123",
  "rol": "paciente"
}
```

Valores válidos para `rol`: `"paciente"` | `"medico"`

Si el correo ya existe: `400 Bad Request — "El correo ya está registrado"`

---

### Citas — `/api/appointments`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| GET | `/api/appointments` | Obtener todas las citas | ❌ Público |
| POST | `/api/appointments` | Crear nueva cita | ❌ Público |
| PUT | `/api/appointments/:id` | Actualizar cita (reagendar/cancelar) | ❌ Público |
| DELETE | `/api/appointments/:id` | Eliminar cita | ❌ Público |

**Body para crear cita:**
```json
{
  "especialidad": "Odontología",
  "fecha": "2026-07-15",
  "hora": "10:00 AM",
  "medico": "Dr. Juan Pérez",
  "sede": "Sede Centro",
  "observaciones": "Primera consulta"
}
```

**Body para actualizar (cancelar):**
```json
{ "estado": "Cancelada" }
```

**Body para actualizar (reagendar):**
```json
{ "fecha": "2026-07-22", "hora": "14:00", "estado": "Pendiente" }
```

Si la cita no existe: `404 Not Found — "Cita #X no encontrada"`

---

## Modelo de datos

### Entidad `User`

| Columna | Tipo TypeORM | Restricciones | Descripción |
|---|---|---|---|
| `id` | `PrimaryGeneratedColumn` | PK, AUTO | ID único |
| `nombre` | `Column({ length: 150 })` | NOT NULL | Nombre completo |
| `email` | `Column({ unique: true })` | NOT NULL, UNIQUE | Correo electrónico |
| `telefono` | `Column({ length: 20, nullable: true })` | — | Teléfono |
| `documento` | `Column({ length: 20, nullable: true })` | — | Número de documento |
| `password` | `Column()` | NOT NULL | Hash bcrypt |
| `rol` | `Column({ type: 'enum', enum: UserRole })` | DEFAULT 'paciente' | `paciente` o `medico` |
| `createdAt` | `CreateDateColumn()` | AUTO | Fecha de registro |

### Entidad `Appointment`

| Columna | Tipo TypeORM | Restricciones | Descripción |
|---|---|---|---|
| `id` | `PrimaryGeneratedColumn` | PK, AUTO | ID único |
| `especialidad` | `Column()` | NOT NULL | Especialidad médica |
| `fecha` | `Column()` | NOT NULL | Fecha (string YYYY-MM-DD) |
| `hora` | `Column()` | NOT NULL | Hora (string, ej. "10:00 AM") |
| `medico` | `Column()` | NOT NULL | Nombre del médico |
| `sede` | `Column()` | NOT NULL | Sede de atención |
| `observaciones` | `Column({ nullable: true })` | — | Notas del paciente |
| `estado` | `Column({ default: 'Pendiente' })` | DEFAULT 'Pendiente' | Estado de la cita |

---

## Ejecutar pruebas

```bash
npm run test          # Pruebas unitarias (Jest)
npm run test:e2e      # Pruebas end-to-end
npm run test:cov      # Cobertura de código
```

---

## Autores

- Kerly Vanessa Sarrias
- Felipe Pinzón Ruiz
- Rubén Andrés Castañeda

**Universidad Iberoamericana · Proyecto de Software · 2026**
