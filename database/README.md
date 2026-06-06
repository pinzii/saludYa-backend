# Scripts de Base de Datos — SaludYa

Esta carpeta contiene los scripts SQL para la gestión de la base de datos PostgreSQL del proyecto SaludYa.

---

## Archivos

| Archivo | Descripción |
|---|---|
| `schema.sql` | Crea la BD, tipos, tablas, índices y datos de prueba (seed) |
| `reset.sql` | Elimina todas las tablas y tipos (solo para desarrollo) |

---

## Cómo ejecutar

### Opción 1 — Desde la terminal (psql)

```bash
# 1. Crear la base de datos y las tablas
psql -U postgres -f database/schema.sql

# 2. Si necesitas resetear y volver a crear (solo desarrollo)
psql -U postgres -d salud_ya -f database/reset.sql
psql -U postgres -f database/schema.sql
```

### Opción 2 — Desde un cliente gráfico (pgAdmin, DBeaver, TablePlus)

1. Abrir el cliente y conectarse a PostgreSQL.
2. Abrir `schema.sql` y ejecutarlo completo.
3. Verificar que se crearon las tablas `users` y `appointments`.

---

## Usuarios de prueba (seed)

Después de ejecutar `schema.sql`, quedan creados estos usuarios:

| Rol | Email | Contraseña |
|---|---|---|
| Paciente | `paciente@saludya.com` | `Test1234` |
| Médico | `medico@saludya.com` | `Test1234` |

---

## Nota sobre TypeORM

En **desarrollo**, TypeORM crea las tablas automáticamente gracias a `synchronize: true` en `app.module.ts`. Los scripts de esta carpeta son para:

- Despliegues manuales en producción (donde `synchronize` debe estar en `false`).
- Restauración de la BD en caso de pérdida de datos.
- Documentación del esquema de la BD para el equipo.
