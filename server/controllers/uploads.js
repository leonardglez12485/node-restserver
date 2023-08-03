const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/users');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;
    let archivo;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                massage: 'No files were uploaded.'
            }
        });
    }
    archivo = req.files.archivo;
    uploadPath = `upload/${tipo}/` + archivo.name;

    //Valitdar tipo de archivo
    let tipoPermitido = ['productos', 'usuarios'];
    if (tipoPermitido.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Los Tipos permitidos son: ' + tipoPermitido.join(' , ')
            }
        });
    };

    //Extensiones Permitidas
    let extensionesValidas = ['jpeg', 'jpg', 'png', 'gif', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'pdf'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Las extensiones validas son: ' + extensionesValidas.join(' , ')
            }
        });
    } else {
        //Cambiar nombre al archivo 
        let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
        uploadPath = `upload/${tipo}/` + nombreArchivo;
        archivo.mv(uploadPath, (err) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    err
                });
            imagenAsign(id, res, nombreArchivo);
        });

        function imagenAsign(id, res, nombreArchivo) {
            if (tipo === 'usuarios') {
                buscarUserBD(id, res, nombreArchivo);
            } else {
                buscarProdBD(id, res, nombreArchivo);
            }

        }

        function buscarUserBD() {
            User.findById(id)
                .then((usuario) => {
                    borrarArchivos(usuario.imagen, 'usuarios');
                    // let pathImagen = path.resolve(__dirname, `../../upload/usuarios/${usuario.imagen}`);
                    // if (fs.existsSync(pathImagen)) {
                    //     fs.unlinkSync(pathImagen);
                    // }
                    usuario.imagen = nombreArchivo;
                    usuario.save();
                    res.json({
                        ok: true,
                        usuario,
                        message: 'File upload and User Picture updated succesfully !!!'
                    });
                })
                .catch((error) => {
                    if (error) {
                        borrarArchivos(nombreArchivo, tipo);
                        res.status(400).json({
                            ok: false,
                            error: {
                                message: 'User not found !!!'
                            }
                        })
                    }
                });
        }

        function buscarProdBD() {
            Producto.findById(id)
                .then((prod) => {
                    borrarArchivos(prod.imagen, 'productos');
                    // let pathImagen = path.resolve(__dirname, `../../upload/usuarios/${usuario.imagen}`);
                    // if (fs.existsSync(pathImagen)) {
                    //     fs.unlinkSync(pathImagen);
                    // }
                    prod.imagen = nombreArchivo;
                    prod.save();
                    res.json({
                        ok: true,
                        prod,
                        message: 'File upload and Picture of Producto updated succesfully !!!'
                    });
                })
                .catch((error) => {
                    if (error) {
                        borrarArchivos(nombreArchivo, tipo);
                        res.status(400).json({
                            ok: false,
                            error: {
                                message: 'Producto not found !!!'
                            }
                        })
                    }
                });
        }
    }

    function borrarArchivos(nombre, tipo) {
        let pathImagen = path.resolve(__dirname, `../../upload/${tipo}/${nombre}`);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }
});

module.exports = app;