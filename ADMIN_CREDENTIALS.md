# Credenciales de Acceso Admin

## Sistema de Acceso Actual

**URL de Acceso:** `/dj-josepe-aqui-mando-yo`
**Método:** Contraseña directa (sin username/email)
**Tabla:** `DJAuth` en base de datos `josepe_DB`

## Información de Login

- **Contraseña:** `#josepe@2025`
- **Hash en BD:** `$2b$12$.3mX3kYbGxkBDR8boBzey.EOGDZlBxeIq9wRy3f7xF6EMcsKaStkC`
- **URL Secreta:** Solo el DJ conoce la URL `/dj-josepe-aqui-mando-yo`
- **Sin username/email:** El sistema solo valida la contraseña contra la BD
- **ID en DJAuth:** 2

## Arquitectura de Seguridad

1. **Acceso público:** Cualquier URL admin muestra 404
2. **Acceso privado:** Solo `/dj-josepe-aqui-mando-yo` permite login
3. **Autenticación:** Contraseña hasheada en tabla `DJAuth`
4. **Sesión:** Cookie `dj_token` con JWT (7 días)

## Ubicación del Código

- **Frontend:** `frontend/app/dj-josepe-aqui-mando-yo/page.js`
- **Backend:** `backend/src/controllers/auth.controller.js`
- **Base de datos:** Tabla `DJAuth` (id, passwordHash)

```sql
-- Estructura de tabla DJAuth
CREATE TABLE `DJAuth` (
  `id` int NOT NULL,
  `passwordHash` varchar(255) NOT NULL
);
```

## Notas de Seguridad

- ✅ **URL secreta** - Solo el DJ conoce la ruta
- ✅ **Contraseña hasheada** - bcrypt con salt
- ✅ **Sin username** - Menos superficie de ataque
- ✅ **Sesión por cookie** - JWT seguro
- ✅ **Sin redirecciones automáticas** - Control total del flujo

## Cómo Acceder al Panel Admin

### Método Único: URL Secreta + Contraseña

1. **Navegar a:** `/dj-josepe-aqui-mando-yo`
2. **Introducir:** Solo la contraseña en el campo único
3. **Autenticación:** Sistema valida contra tabla `DJAuth`
4. **Redirección:** Acceso directo al dashboard `/admin/dashboard`

## Estado Actual

- ✅ Sistema simplificado a URL secreta + contraseña única
- ✅ Tabla `DJAuth` configurada con contraseña hasheada
- ✅ Sin métodos legacy (clicks, PIN, username/password)
- ✅ Autenticación JWT con cookie HTTP-only
- ✅ Frontend y backend limpios sin código obsoleto

## Próximos Pasos

1. ✅ Asegurarse de que el backend esté ejecutándose
2. ✅ Navegar a `/dj-josepe-aqui-mando-yo`
3. ✅ Introducir la contraseña: `#josepe@2025`
4. ✅ Acceder al dashboard de administración

## Prueba de Acceso

**URL completa:** http://localhost:3000/dj-josepe-aqui-mando-yo
**Contraseña:** #josepe@2025

---

_Documento actualizado - Fecha: 17 de septiembre de 2025_
