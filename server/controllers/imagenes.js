const express = require('express');
const fs = require('fs');
let app = express();
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authenticatios');


app.get('/imagen/:tipo/:img', verifyTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${img}`);
    let noImgPath = path.resolve(__dirname, '../assets/11.jpg');

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.status(404).sendFile(noImgPath);
    }

});



module.exports = app;