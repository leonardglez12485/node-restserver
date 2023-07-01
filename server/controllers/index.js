const express = require('express');
const User = require('../models/users');
const app = express();

app.use(require('./control'));
app.use(require('./login'));

module.exports = app;