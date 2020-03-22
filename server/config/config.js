// ==========================
// Puerto
// ==========================
process.env.PORT = process.env.PORT || 3000;

// ==========================
// Puerto
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Base de Datos
// ==========================
let urlDB = process.env.MONGO_URI;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
}

process.env.URLDB = urlDB;

// ==========================
// Vencimiento del Token
// ==========================
// 60 Segundos x 60 Minutos x 24 Horas x 30 Dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ==========================
// Semilla de Autenticacion
// ==========================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';