const User = require('../models/users');
const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');

//=====================
//Verificacion de Token
//=====================

let verifyToken = (req, res, next) => {
    const token = req.header('token')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.SEED_TOKEN)
        req.User = verified
        next() // continuamos

    } catch (error) {
        res.status(400).json({ error: 'token no es válido' })
    }

};


//=================================
//Verificacion de Token pa Imagenes
//=================================
let verifyTokenImg = (req, res, next) => {
    let token = req.query.token;
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.SEED_TOKEN)
        req.User = verified
        next() // continuamos

    } catch (error) {
        res.status(400).json({ error: 'Invalid Token' })
    }
}

//===========================
//Otra forma de implementarlo
//===========================
//let verifyToken = (req, res, next) => {
// let token = req.get('token');
// let use;
// jwt.verify(token, process.env.SEED_TOKEN, (err, usuario) => {
//     if (err) {
//         res.status(401).json({
//             ok: false,
//             err: {
//                 message: 'Token no valido !!!!!!'
//             }
//         });
//     }

//     req.User = usuario;
//     next();
// });
// }


//==========================
//Verificacion role de Admin
//==========================

let verifyAdmin = (req, res, next) => {
    const u = req.User
        // console.log(u.usuario.role);
    if (u.usuario.role === 'ADMIN_ROLE') {

        next();
    } else {
        return res.status(401).json({
            ok: false,
            message: 'Privilegios de Admin necesario !!!!!!',
        });
    }




}

module.exports = { verifyToken, verifyAdmin, verifyTokenImg }