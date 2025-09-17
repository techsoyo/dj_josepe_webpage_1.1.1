import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import 'dotenv/config';

/**
 * Script para establecer la contraseña del DJ
 * Hashea la contraseña y la guarda en la tabla DJAuth
 */

async function setDJPassword() {
  try {
    // Nueva contraseña del DJ
    const newPassword = '#josepe@2025';
    
    console.log('🔐 Hasheando contraseña...');
    
    // Hashear la contraseña con bcrypt (salt rounds: 12)
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('✅ Contraseña hasheada:', hashedPassword);
    
    // Configuración de la base de datos
    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'admin123',
      database: process.env.DB_NAME || 'josepe_DB',
      port: process.env.DB_PORT || 3306
    };
    
    console.log('📊 Conectando a la base de datos...');
    
    // Conectar a MySQL
    const connection = await mysql.createConnection(dbConfig);
    
    // Verificar si ya existe un registro
    const [existing] = await connection.execute('SELECT id FROM DJAuth LIMIT 1');
    
    if (existing.length > 0) {
      // Actualizar contraseña existente
      await connection.execute(
        'UPDATE DJAuth SET passwordHash = ? WHERE id = ?',
        [hashedPassword, existing[0].id]
      );
      console.log('✅ Contraseña actualizada en DJAuth (ID:', existing[0].id, ')');
    } else {
      // Insertar nueva contraseña
      const [result] = await connection.execute(
        'INSERT INTO DJAuth (passwordHash) VALUES (?)',
        [hashedPassword]
      );
      console.log('✅ Nueva contraseña insertada en DJAuth (ID:', result.insertId, ')');
    }
    
    // Cerrar conexión
    await connection.end();
    
    console.log('\n🎉 ¡Contraseña configurada exitosamente!');
    console.log('📝 Contraseña en texto plano:', newPassword);
    console.log('🔒 Hash guardado en DB:', hashedPassword);
    console.log('\n🌐 Acceso admin: http://localhost:3000/dj-josepe-aqui-mando-yo');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar script
setDJPassword();