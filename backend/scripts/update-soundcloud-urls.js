const mysql = require('mysql2/promise');

// Configuración de la base de datos
const dbConfig = {
  host: '192.168.1.40',
  user: 'admin',
  password: 'admin123',
  database: 'josepe_DB'
};

// URLs de prueba que sabemos que funcionan
const workingUrls = [
  'https://soundcloud.com/forss/flickermood',
  'https://soundcloud.com/mrsuicidesheep/mitis-born',
  'https://soundcloud.com/illenium/good-things-fall-apart-illenium-remix',
  'https://soundcloud.com/porter-robinson/language',
  'https://soundcloud.com/skrillex/bangarang-feat-sirah',
  'https://soundcloud.com/madeon/pay-no-mind-feat-passion-pit',
  'https://soundcloud.com/flume/sleepless',
  'https://soundcloud.com/owslaofficial/rl-grime-core',
  'https://soundcloud.com/trap-nation/herobust-move-mint',
  'https://soundcloud.com/future-classic/flume-ezra-koenig-tennis-court'
];

async function updateSoundCloudUrls() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    // Obtener todos los registros
    const [rows] = await connection.execute('SELECT id, title FROM MusicSet ORDER BY id');
    
    console.log('Actualizando URLs de SoundCloud...');
    console.log('=====================================');
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const newUrl = workingUrls[i % workingUrls.length]; // Usar URLs rotativas
      
      await connection.execute(
        'UPDATE MusicSet SET soundcloudUrl = ? WHERE id = ?',
        [newUrl, row.id]
      );
      
      console.log(`ID ${row.id}: "${row.title}" -> ${newUrl}`);
    }
    
    console.log('=====================================');
    console.log('✅ URLs actualizadas correctamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Función para verificar URLs existentes
async function checkCurrentUrls() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute('SELECT id, title, soundcloudUrl FROM MusicSet ORDER BY id');
    
    console.log('URLs actuales en la base de datos:');
    console.log('=====================================');
    
    rows.forEach(row => {
      console.log(`ID ${row.id}: "${row.title}"`);
      console.log(`URL: ${row.soundcloudUrl}`);
      console.log('-------------------------------------');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Ejecutar según el argumento de línea de comandos
const action = process.argv[2];

if (action === 'check') {
  checkCurrentUrls();
} else if (action === 'update') {
  updateSoundCloudUrls();
} else {
  console.log('Uso:');
  console.log('  node update-soundcloud-urls.js check   - Ver URLs actuales');
  console.log('  node update-soundcloud-urls.js update  - Actualizar con URLs que funcionan');
}