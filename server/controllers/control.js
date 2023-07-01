const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/users');
const { verifyToken, verifyAdmin } = require('../middlewares/authenticatios');
const app = express();
const bodyParser = require('body-parser');
const { verify } = require('jsonwebtoken');
//const { verifyToken, verifyAdmin } = require('../middlewares/authenticatios');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/usuario', [verifyToken, verifyAdmin], (req, res) => {
    let conteo = 0;
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 10;
    desde = Number(desde);
    limite = Number(limite);
    User.count({ 'estado': true })
        .then((cont) => {
            conteo = cont;
        })
        .catch((err) => console.log(err));

    User.find({ 'estado': true }, 'nombre role estado email')
        .skip(desde)
        .limit(limite)
        .exec()
        .then((usuario) => {
            res.json({
                ok: true,
                usuario,
                conteo
            })
        })
        .catch((error) => console.log(error));
});

app.put('/usuario/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    //et body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'imagen', 'role']);

    User.findByIdAndUpdate(id, body, { new: true, runvalidator: true })
        .then((resultado) => {
            res.json({
                ok: true
            })
        })
        .catch((error) => console.log(error));

});

app.post('/usuario', (req, res) => {
    let body = req.body;

    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save()
        .then((resultado) => {
            res.json({
                ok: true
            });
            return console.log('Added to DataBase !!!!!');
        })
        .catch((error) => console.log(error));



});


app.delete('/usuario/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    };

    User.findByIdAndUpdate(id, cambiaEstado, { new: true })
        .then((resultado) => {
            res.json({
                ok: true,
                message: 'Usuario Eliminado'
            })
        })
        .catch((error) => console.log(error, 'Usuario no encontrado'));

});

module.exports = app;