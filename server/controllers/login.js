const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const app = express();

app.post('/login', function(req, res) {
    let body = req.body;
    User.findOne({ email: body.email })
        .then((userDB) => {
            if (!userDB) {
                return res.status(400.).json({
                    ok: false,
                    err: {
                        message: '(Usuario) o Contraseña incorrectos'
                    }
                });
            }
            if (!bcrypt.compareSync(body.password, userDB.password)) {
                return res.status(400.).json({
                    ok: false,
                    err: {
                        message: 'Usuario o (Contraseña) incorrectos'
                    }
                });
            }
            let token = jwt.sign({
                usuario: userDB
            }, process.env.SEED_TOKEN, { expiresIn: process.env.VENC_TOKEN || 5183944 });
            res.json({
                ok: true,
                user: userDB,
                token
            });
        })
        .catch(err => onsole.log(err))

});







module.exports = app;