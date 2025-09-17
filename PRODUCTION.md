# 🚀 DJ JOSEP - DOCUMENTACIÓN DE PRODUCCIÓN

## 📋 Scripts de Deployment Disponibles

### 1. **DEPLOYMENT COMPLETO**

```bash
.\deploy-production.ps1
```

**Descripción**: Script principal que configura todo el entorno de producción

- ✅ Verifica prerrequisitos (Node.js, pnpm, git)
- ✅ Limpia procesos activos
- ✅ Configura entornos de producción
- ✅ Configura MySQL automáticamente
- ✅ Instala dependencias
- ✅ Construye aplicación para producción
- ✅ Crea scripts de inicio

**Parámetros opcionales**:

```bash
.\deploy-production.ps1 -MySQLHost "192.168.1.50" -MySQLUser "root" -MySQLPassword "newpass"
.\deploy-production.ps1 -SkipDatabase           # Saltar configuración MySQL
.\deploy-production.ps1 -ForceReinstall         # Reinstalar dependencias
```

### 2. **INICIO RÁPIDO PRODUCCIÓN**

```bash
.\start-production.bat
```

**Descripción**: Inicia la aplicación en modo producción

- ✅ ASCII art de bienvenida
- ✅ Verificaciones automáticas
- ✅ Configuración de entorno
- ✅ Inicio secuencial backend → frontend
- ✅ Limpieza automática al cerrar

### 3. **CONFIGURADOR MYSQL**

```bash
node configure-mysql.js
```

**Descripción**: Configura específicamente MySQL para producción

- ✅ Actualiza .env.prod con credenciales MySQL
- ✅ Verifica conexión a base de datos
- ✅ Verifica estructura de tablas
- ✅ Reporta estado completo

**Parámetros opcionales**:

```bash
node configure-mysql.js --host=192.168.1.40 --user=admin --password=admin123
```

## 🔄 Flujo de Deployment Recomendado

### Primera vez (Setup completo):

```bash
# 1. Deployment completo
.\deploy-production.ps1

# 2. Iniciar aplicación
.\start-production.bat
```

### Uso diario:

```bash
# Inicio rápido
.\start-production.bat
```

### Solo reconfigurar MySQL:

```bash
# Si cambias servidor/credenciales MySQL
node configure-mysql.js --host=NEW_HOST --user=NEW_USER --password=NEW_PASS
```

## 📡 Configuración MySQL por Defecto

```bash
Host: 192.168.1.40
Puerto: 3306
Usuario: admin
Password: admin123
Base de datos: josepe_DB
```

## 🔧 Variables de Entorno

### Backend (.env.prod)

- `NODE_ENV=production`
- `PORT=4000`
- `DATABASE_URL=mysql://...`
- `JWT_SECRET=...`
- Rate limiting optimizado para DJ

### Frontend (.env.prod)

- `NODE_ENV=production`
- `NEXT_PUBLIC_API_URL=http://localhost:4000`
- Configuración optimizada

## 📊 Verificaciones Automáticas

Los scripts verifican automáticamente:

- ✅ Node.js instalado
- ✅ pnpm instalado
- ✅ Git disponible
- ✅ MySQL conectividad
- ✅ Estructura de base de datos
- ✅ Archivos de configuración
- ✅ Build de producción

## 🎯 Acceso Admin en Producción

### Método Único: URL Secreta con Contraseña

1. **Navegar a la URL secreta**: `/dj-josepe-aqui-mando-yo`
2. **Ingresar contraseña** en el campo único
3. **Acceso directo** al dashboard admin

**Nota**: La URL secreta solo es conocida por el DJ. Cualquier otra URL admin muestra página 404.

## 🔍 Troubleshooting

### Error: MySQL Connection Failed

```bash
# Verificar servidor MySQL
ping 192.168.1.40

# Reconfigurar con nuevas credenciales
node configure-mysql.js --host=NEW_HOST --user=NEW_USER --password=NEW_PASS
```

### Error: Puerto en uso

```bash
# Limpiar procesos Node.js
taskkill /f /im node.exe

# Reiniciar
.\start-production.bat
```

### Error: Dependencias

```bash
# Reinstalar todo
.\deploy-production.ps1 -ForceReinstall
```

## 📈 Optimizaciones de Producción

- **Frontend**: Build optimizado con Next.js
- **Backend**: Logging mínimo, rate limiting ajustado
- **Base de datos**: Connection pooling configurado
- **Memoria**: Gestión automática de procesos
- **Seguridad**: Variables de entorno separadas

## 🔄 Volver a Desarrollo

```bash
# Cambiar a modo desarrollo
node set-env.js dev

# O usar script de desarrollo
.\start.ps1
```

---

**🎵 ¡Listo para que DJ Josep use su sitio web profesional!**
