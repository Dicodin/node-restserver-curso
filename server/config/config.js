//==============================
// Puerto
//==============================

process.env.PORT = process.env.PORT || 3000;

//==============================
// Entorno
//==============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============================
// Vencimiento del Token
//==============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
// 1000 milisegundos (así el token caduca en 30 días)
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30 * 1000;

//==============================
// Seed de autenticación
//==============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//==============================
// Base de datos
//==============================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==============================
// Google Client ID
//==============================

process.env.CLIENT_ID = process.env.CLIENT_ID || '220373152188-gke0f7p4ba4bo4vbi1l7as05g89lub2o.apps.googleusercontent.com';