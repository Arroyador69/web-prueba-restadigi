const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// En Railway: persistencia con volumen.
// Prioridad: DATABASE_PATH > RAILWAY_VOLUME_MOUNT_PATH/database.db > ./database.db
const volumeMount = process.env.RAILWAY_VOLUME_MOUNT_PATH;
const explicitPath = process.env.DATABASE_PATH;
const dbPath = explicitPath
  || (volumeMount ? path.join(volumeMount, 'database.db') : null)
  || path.join(__dirname, '..', 'database.db');
if (process.env.NODE_ENV === 'production') {
  console.log('💾 Base de datos:', dbPath, volumeMount ? '(volumen: ' + volumeMount + ')' : '(sin volumen)');
}

// Asegurar que el directorio existe (volumen o DATABASE_PATH)
const dbDir = path.dirname(dbPath);
if (dbDir && !fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (e) {
    console.warn('No se pudo crear directorio de BD:', dbDir, e.message);
  }
}

// Promisificar las operaciones de la base de datos
function getDb() {
  return new sqlite3.Database(dbPath);
}

function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.run(query, params, function(err) {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
}

function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.get(query, params, (err, row) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    const db = getDb();
    db.all(query, params, (err, rows) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

module.exports = {
  getDb,
  runQuery,
  getQuery,
  allQuery
};
