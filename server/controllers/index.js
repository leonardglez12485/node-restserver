const express = require('express');
const User = require('../models/users');
const app = express();

app.use(require('./control'));
app.use(require('./login'));
app.use(require('./c_categoria'));
app.use(require('./c_producto'));
app.use(require('./uploads'));
app.use(require('./imagenes'));

module.exports = app;