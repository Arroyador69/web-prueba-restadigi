const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// En Railway: usar volumen persistente (ej. DATABASE_PATH=/app/data/database.db)
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'database.db');

// Asegurar que el directorio existe (para Railway con volumen en /app/data)
if (process.env.DATABASE_PATH) {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.warn('No se pudo crear directorio de BD:', dir, e.message);
    }
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
