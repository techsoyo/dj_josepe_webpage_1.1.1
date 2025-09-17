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
const [form, setForm] = useState({ username: "admin", password: "admin123" });

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
    isActive: true,
  },
});
```

## Cómo Acceder al Panel Admin

### Método 1: Clicks en Logo (Principal)

- **Acción:** Haz clic 5 veces en el logo del sitio en 3 segundos
- Disponible en cualquier página del sitio donde aparezca el logo
- Aparecerá un modal con las instrucciones de acceso
- **Ventaja:** Funciona en todos los dispositivos (desktop y móvil)

### Método 2: Código PIN Visual

- **Ubicación:** Campo PIN en la esquina inferior derecha
- **Código:** 1234 (por defecto)
- Ingresa el código y presiona Enter o el botón de acceso
- Te redirigirá automáticamente al panel de login
- **Ventaja:** Acceso discreto y rápido

### Método 3: Secuencia de Teclas (Backup)

- Escribe la palabra "admin" en cualquier campo de texto **excepto campos de contraseña**
- Aparecerá un botón flotante para acceder al panel
- **Nota:** La secuencia no funciona en campos de contraseña por seguridad

### Método 4: URL Directa

- Ve directamente a: `/admin/login`

## Estado Actual

- ✅ Usuario admin creado en base de datos (seed ejecutado)
- ✅ Frontend configurado para usar username
- ✅ Credenciales precargadas en formulario de login
- ✅ Nuevo sistema de acceso implementado (5 clicks en logo + PIN visual)
- ✅ Métodos de acceso compatibles con dispositivos móviles y desktop
- ✅ Componentes AdminAccess.js y PinAccess.js actualizados

## Próximos Pasos

1. Asegurarse de que el backend esté ejecutándose
2. Probar los nuevos métodos de acceso (clicks en logo y PIN 1234)
3. Acceder al panel de administración con las credenciales arriba
4. Cambiar la contraseña por defecto por seguridad
5. Configurar un PIN personalizado si se desea (actualmente es 1234)

---

_Documento actualizado - Fecha: 17 de septiembre de 2025_
