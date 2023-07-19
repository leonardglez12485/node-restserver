//===============
//Puerto
//===============
process.env.PORT = process.env.PORT || 3000;

//===============
//Entorno
//===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=====================
//Vencimiento del Token
//=====================
// 60 segundos 
// 60 minutos
// 24 horas
// 30 dias
process.env.VENC_TOKEN = '48h';

//=====================
//SEED de autenticacion
//=====================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-ser-ed-desarrollo';

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/cafe';
} else {
    urlDB = 'mongodb+srv://leonardglez12485:Realmadridfc*13@cluster0.lczn6m6.mongodb.net/cafe';
    // mongodb + srv: //mern-user:M1UAoMxrwrDJ8UN1@cluster0.zebxd.mongodb.net/db_calendar
}

process.env.URLDB = urlDB;

//=====================
// Google Client ID
//=====================
process.env.GOOGLECLIENT_ID = process.env.GOOGLECLIENT_ID || '164147363667-q1pbmjjrpks9q8t7dlrmpsc5eprpi9dr.apps.googleusercontent.com'