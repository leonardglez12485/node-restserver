const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const connect = require('./connect');
const initDB = require('./connect');
const path = require('path');
const cors = require('cors');
require('./config/config');
require('../server/controllers/control');


//-- COnfigurando el cors
// var whitelist = ['http://127.0.0.1:3000', 'https://accounts.google.com/gsi']
// var corsOptions = {
//         origin: function(origin, callback) {
//             if (whitelist.indexOf(origin) !== -1 || !origin) {
//                 callback(null, true)
//             } else {
//                 callback(new Error('Not allowed by CORS'))
//             }
//         }
//     }
var corsOptions = {
    origin: 'https://accounts.google.com/gsi/client',
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

app.use(cors());


//--Configuracion global de rutas--//
app.use(require('./controllers/index'));

//--habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public/')), cors(corsOptions));
//console.log(path.resolve(__dirname, '../public/'));

//--parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//--parse application/json
app.use(bodyParser.json())




initDB;
app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`);
})