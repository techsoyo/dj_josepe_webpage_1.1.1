# 🔧 Gestión de Entornos - DJ Josepe Webpage

## 📋 Estructura de Configuración

Este proyecto utiliza una estructura de entornos separados para desarrollo y producción:

### 📁 **Backend (`/backend`)**

- `.env.dev` - Configuración de desarrollo (SQLite, logging habilitado)
- `.env.prod` - Configuración de producción (MySQL, optimizado para DJ)
- `.env` - Archivo activo (copiado desde .dev o .prod)

### 📁 **Frontend (`/frontend`)**

- `.env.dev` - Configuración de desarrollo
- `.env.prod` - Configuración de producción
- `.env.local` - Archivo activo (copiado desde .dev o .prod)

## 🚀 **Cambio de Entornos**

### **Opción 1: Script Node.js**

```bash
# Configurar desarrollo
node set-env.js dev

# Configurar producción (para el DJ)
node set-env.js prod
```

### **Opción 2: Script PowerShell (Windows)**

```powershell
# Configurar desarrollo
.\set-env.ps1 dev

# Configurar producción (para el DJ)
.\set-env.ps1 prod
```

### **Opción 3: Manual**

```bash
# Backend
copy backend\.env.dev backend\.env        # Para desarrollo
copy backend\.env.prod backend\.env       # Para producción

# Frontend
copy frontend\.env.dev frontend\.env.local   # Para desarrollo
copy frontend\.env.prod frontend\.env.local  # Para producción
```

## ⚙️ **Diferencias entre Entornos**

### 🛠️ **Desarrollo (.dev)**

- **Base de datos:** SQLite (más fácil para desarrollo)
- **Logging:** Habilitado con detalles
- **Rate limiting:** Muy permisivo (1000 requests)
- **Debug:** Activado
- **Archivos:** Tamaño máximo 10MB

### 🚀 **Producción (.prod)**

- **Base de datos:** MySQL (configuración actual del DJ)
- **Logging:** Mínimo para rendimiento
- **Rate limiting:** Moderado (200 requests)
- **Debug:** Desactivado
- **Archivos:** Tamaño máximo 50MB

## 📝 **Configuración Actual**

### **MySQL (Producción)**

- Host: `192.168.1.40:3306`
- Usuario: `admin`
- Contraseña: `admin123`
- Base de datos: `josepe_DB`

### **Puertos**

- Backend: `4000`
- Frontend: `3000`

## 🎯 **Recomendaciones de Uso**

- **Para desarrolladores:** Usar siempre `node set-env.js dev`
- **Para el DJ:** Usar siempre `node set-env.js prod`
- **Antes de commit:** Verificar que no se suban archivos `.env` principales
- **Backup:** Los archivos `.env.dev` y `.env.prod` deben estar versionados

## 🔄 **Flujo de Trabajo**

1. **Desarrollo:**

   ```bash
   node set-env.js dev
   node start.js
   ```

2. **Producción (DJ):**

   ```bash
   node set-env.js prod
   node start.js
   ```

3. **Verificar configuración:**
   - Backend detectará automáticamente el tipo de BD
   - Frontend usará las URLs correctas
   - Los logs se comportarán según el entorno
