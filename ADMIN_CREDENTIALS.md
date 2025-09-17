# Credenciales de Acceso Admin

## Información de Login por Defecto

**Usuario:** admin
**Contraseña:** admin123
**Email:** admin@dj.local

## Notas Importantes

- Estas son las credenciales por defecto configuradas en el seed de Prisma
- El backend espera un `username` en lugar de `email` para el login
- Se recomienda cambiar la contraseña después del primer acceso por motivos de seguridad

## Ubicación del Código

Las credenciales están configuradas en:
- `frontend/app/admin/login/page.js` - línea 15 (formulario)
- `backend/prisma/seed.js` - líneas 10-18 (usuario en base de datos)

```javascript
// Frontend - formulario precargado
const [form, setForm] = useState({ username: 'admin', password: 'admin123' });

// Backend - usuario creado en seed
const admin = await prisma.user.upsert({
  where: { email: "admin@dj.local" },
  update: {},
  create: {
    username: "admin",
    name: "DJ Josepe Admin",
    email: "admin@dj.local",
    password: hashedPassword, // admin123 hasheada
    role: "admin",
    isActive: true
  }
});
```

## Cómo Acceder al Panel Admin

### Método 1: Combinación de Teclas
- **Combinación:** `Ctrl + Alt Gr + ñ`
- Presiona estas teclas simultáneamente en cualquier página del sitio
- Aparecerá un botón flotante para acceder al panel

### Método 2: Secuencia de Teclas (Móvil)
- Escribe la palabra "admin" en cualquier campo de texto **excepto campos de contraseña**
- Aparecerá el mismo botón flotante
- **Nota:** La secuencia no funciona en campos de contraseña por seguridad

### Método 3: URL Directa
- Ve directamente a: `/admin/login`

## Estado Actual

- ✅ Usuario admin creado en base de datos (seed ejecutado)
- ✅ Frontend configurado para usar username
- ✅ Credenciales precargadas en formulario de login

## Próximos Pasos

1. Asegurarse de que el backend esté ejecutándose
2. Acceder al panel de administración con las credenciales arriba
3. Cambiar la contraseña por defecto por seguridad

---
*Documento actualizado - Fecha: 8 de septiembre de 2025*
