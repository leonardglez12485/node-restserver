const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const connect = require('./connect');
const initDB = require('./connect');
require('./config/config');
require('../server/controllers/control');

//--Configuracion global de rutas--//
app.use(require('./controllers/index'));

//--parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//--parse application/json
app.use(bodyParser.json())


initDB;
app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${process.env.PORT}`);
})