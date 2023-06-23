//===============
//Puerto
//===============
process.env.PORT = process.env.PORT || 3000;

//===============
//Entorno
//===============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===============
//Base de Datos
//===============

let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/cafe';
} else {
    urlDB = 'mongodb+srv://leonardglez12485:Realmadridfc*13@cluster0.lczn6m6.mongodb.net/cafe';
    // mongodb + srv: //mern-user:M1UAoMxrwrDJ8UN1@cluster0.zebxd.mongodb.net/db_calendar
}
process.env.URLDB = urlDB;