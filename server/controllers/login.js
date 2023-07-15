const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLECLIENT_ID);

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


//Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLECLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        imagen: payload.picture,
        google: true,
    }
}
//verify().catch(console.error);

app.post('/google', async(req, res) => {

    let token = req.body.idToken;
    // let googleUser = new User({ nombre: 'Juan Diaz', email: 'jdiaz@gmail.com', password: '12345', google: false });
    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                err: e,
            });
        });

    User.findOne({ email: googleUser.email })
        .then((userDB) => {
            if (!userDB) {
                let userNew = new User();
                userNew.nombre = googleUser.nombre;
                userNew.email = googleUser.email;
                userNew.password = ':)';
                userNew.google = true;
                userNew.imagen = googleUser.imagen;

                userNew.save()
                    .then((resultado) => {
                        let token = jwt.sign({
                            usuario: userDB
                        }, process.env.SEED_TOKEN, { expiresIn: process.env.VENC_TOKEN || 5183944 });
                        res.json({
                            ok: true,
                            User: userNew,
                            token
                        });
                        return console.log('Added to DataBase !!!!!');
                    })
            } else {
                if (userDB.google === false) {
                    res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe usar el metodo de autenticacion normal'
                        }
                    });
                } else {
                    let token = jwt.sign({
                        usuario: googleUser
                    }, process.env.SEED_TOKEN, { expiresIn: process.env.VENC_TOKEN || 5183944 });
                    res.json({
                        ok: true,
                        User: googleUser,
                        message: 'Autenticacion Corerecta'
                    });
                }

            }
        })

    .catch(err => {
            return res.status(500).json({
                ok: false,
                err,

            });
        })
        // res.json({
        //     User: googleUser
        // });
});




module.exports = app;