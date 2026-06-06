-- ============================================================
--  SaludYa — Script de RESET de base de datos
-- ============================================================
--  ⚠️  ADVERTENCIA: Este script elimina TODOS los datos.
--  Usar ÚNICAMENTE en entornos de desarrollo/pruebas.
--  NUNCA ejecutar en producción.
-- ============================================================

-- Eliminar tablas en orden inverso (respetando dependencias)
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS users;

-- Eliminar el tipo enum personalizado
DROP TYPE IF EXISTS user_role;

-- Confirmación
SELECT 'Reset completado. Ejecuta schema.sql para recrear las tablas.' AS mensaje;
