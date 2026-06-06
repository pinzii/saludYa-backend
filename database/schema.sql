-- ============================================================
--  SaludYa — Script de creación de base de datos
--  Sistema de Gestión y Agendamiento de Citas Médicas
-- ============================================================
--  Universidad Iberoamericana · Proyecto de Software · 2026
--  Autores: Kerly Vanessa Sarrias · Felipe Pinzón · Rubén Castañeda
-- ============================================================
--
--  Motor:      PostgreSQL 15+
--  Nombre BD:  salud_ya
--
--  INSTRUCCIONES DE USO:
--    1. Conectarse a PostgreSQL como superusuario
--    2. Crear la base de datos (ver sección 1)
--    3. Conectarse a la BD y ejecutar el resto del script
--
--  NOTA: TypeORM con synchronize:true crea las tablas
--  automáticamente en desarrollo. Este script sirve para
--  despliegues manuales, entornos de producción o restauración.
-- ============================================================


-- ============================================================
-- SECCIÓN 1: CREAR BASE DE DATOS
-- ============================================================
-- Ejecutar este bloque conectado a la BD por defecto (postgres)
-- Comentar si la BD ya existe.

CREATE DATABASE salud_ya
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_CO.UTF-8'
    LC_CTYPE = 'es_CO.UTF-8'
    TEMPLATE = template0;

-- Conectarse a la BD antes de continuar:
-- \c salud_ya


-- ============================================================
-- SECCIÓN 2: TIPOS PERSONALIZADOS (ENUMS)
-- ============================================================

-- Tipo enumerado para los roles de usuario.
-- Valores definidos en: src/users/entities/user.entity.ts (UserRole)
CREATE TYPE user_role AS ENUM ('paciente', 'medico');


-- ============================================================
-- SECCIÓN 3: TABLAS
-- ============================================================

-- ------------------------------------------------------------
-- Tabla: users
-- Almacena los usuarios registrados en el sistema.
-- Entidad TypeORM: src/users/entities/user.entity.ts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    -- Identificador único autogenerado
    id            SERIAL          PRIMARY KEY,

    -- Nombre completo del usuario (requerido)
    nombre        VARCHAR(150)    NOT NULL,

    -- Correo electrónico usado para login (único en el sistema)
    email         VARCHAR(255)    NOT NULL UNIQUE,

    -- Número de teléfono de contacto (opcional)
    telefono      VARCHAR(20),

    -- Número de documento de identidad (opcional)
    documento     VARCHAR(20),

    -- Hash bcrypt de la contraseña (salt factor 10)
    -- NUNCA se almacena la contraseña en texto plano
    password      VARCHAR(255)    NOT NULL,

    -- Rol del usuario en el sistema
    -- 'paciente': puede agendar y gestionar sus citas
    -- 'medico'  : puede consultar su agenda de citas
    rol           user_role       NOT NULL DEFAULT 'paciente',

    -- Timestamp de creación generado automáticamente por TypeORM
    "createdAt"   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas por email (usado en login)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);


-- ------------------------------------------------------------
-- Tabla: appointments
-- Almacena las citas médicas agendadas por los pacientes.
-- Entidad TypeORM: src/appointments/entities/appointment.entity.ts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS appointments (
    -- Identificador único autogenerado
    id            SERIAL          PRIMARY KEY,

    -- Especialidad médica seleccionada por el paciente
    -- Valores posibles: 'Odontología', 'Periodoncia', 'General'
    especialidad  VARCHAR(100)    NOT NULL,

    -- Fecha de la cita en formato string (ej. '2026-07-15')
    -- Se almacena como VARCHAR para preservar el formato del frontend
    fecha         VARCHAR(20)     NOT NULL,

    -- Hora de la cita en formato 12h (ej. '10:00 AM')
    hora          VARCHAR(20)     NOT NULL,

    -- Nombre del médico asignado
    medico        VARCHAR(255)    NOT NULL,

    -- Sede de atención: 'Sede Norte', 'Sede Centro' o 'Sede Sur'
    sede          VARCHAR(100)    NOT NULL,

    -- Notas u observaciones adicionales del paciente (opcional)
    observaciones TEXT,

    -- Estado actual de la cita
    -- 'Pendiente'  : cita agendada, fecha futura
    -- 'Completada' : fecha ya pasó (calculado en frontend)
    -- 'Cancelada'  : cancelada manualmente por el paciente
    -- 'Confirmada' : confirmada por el médico
    estado        VARCHAR(50)     NOT NULL DEFAULT 'Pendiente'
);

-- Índice para consultas por estado (usado en la vista "Mis Citas")
CREATE INDEX IF NOT EXISTS idx_appointments_estado ON appointments(estado);


-- ============================================================
-- SECCIÓN 4: DATOS DE PRUEBA (SEED)
-- ============================================================
-- Datos iniciales para probar el sistema localmente.
-- Las contraseñas están hasheadas con bcrypt (salt 10).
-- Contraseña original de todos los usuarios de prueba: Test1234

INSERT INTO users (nombre, email, telefono, documento, password, rol)
VALUES
    (
        'Ana María Gómez',
        'paciente@saludya.com',
        '3001234567',
        '1020304050',
        -- Hash bcrypt de 'Test1234'
        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHiu',
        'paciente'
    ),
    (
        'Dr. Juan Pérez',
        'medico@saludya.com',
        '3107654321',
        '9080706050',
        -- Hash bcrypt de 'Test1234'
        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHiu',
        'medico'
    );

-- Citas de prueba para el paciente con id=1
INSERT INTO appointments (especialidad, fecha, hora, medico, sede, observaciones, estado)
VALUES
    (
        'Odontología',
        '2026-08-10',
        '09:00 AM',
        'Dr. Juan Pérez',
        'Sede Centro',
        'Revisión anual de rutina',
        'Pendiente'
    ),
    (
        'Periodoncia',
        '2026-06-01',
        '11:00 AM',
        'Dr. Carlos Ramírez',
        'Sede Norte',
        '',
        'Completada'
    ),
    (
        'General',
        '2026-05-15',
        '03:00 PM',
        'Dra. María Gómez',
        'Sede Sur',
        'Dolor de cabeza frecuente',
        'Cancelada'
    );


-- ============================================================
-- SECCIÓN 5: VERIFICACIÓN
-- ============================================================
-- Consultas para confirmar que el script se ejecutó correctamente.

SELECT 'Tabla users creada con ' || COUNT(*) || ' registro(s).' AS resultado
FROM users;

SELECT 'Tabla appointments creada con ' || COUNT(*) || ' registro(s).' AS resultado
FROM appointments;
