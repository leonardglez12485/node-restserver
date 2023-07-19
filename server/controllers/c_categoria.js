const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authenticatios');
const app = express();
const user = require('../models/users');
let Categoria = require('../models/categoria');
const { populate } = require('../models/producto');


//-----------------------------
//-Obtener todas las Categorias 
//-----------------------------

app.get('/categoria', verifyToken, (req, res) => {
    let conteo = 0;
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 10;
    Categoria.count()
        .then((cont) => {
            conteo = cont;
        })
        .catch((error) => console.log(error));
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .then((categoria) => {
            res.json({
                ok: true,
                categoria,
                conteo
            })
        })
        .catch((error) => {
            res.status(500).json({
                ok: false,
                error
            });
        });

});

//---------------------------
//-Obtener una sola Categoria 
//---------------------------

app.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id)
        .then((categoria) => {
            res.json({
                ok: true,
                categoria
            })
        })
        .catch((error) => {
            res.status(500).json({
                ok: false,
                id: error.value,
                message: `El id: ${id} no es Correcto !!!!!`
            });
        });
});

//--------------------
//-Adicionar Categoria
//--------------------

app.post('/categoria', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.User;
    let cat = new Categoria({
        descripcion: body.descripcion,
        usuario: user.usuario._id
    });

    cat.save()
        .then((error, resultado) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            } else {
                res.json({
                    ok: true,
                    cat
                });
                return console.log('New Category added to DataBase !!!!!');
            }
        })
        .catch((error) => console.log(error));

});

//--------------------
//-Eliminar Categoria
//--------------------

app.delete('/categoria/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id)
        .then((resolve) => {
            res.json({
                ok: true,
                message: 'Usuario Eliminado'
            });
        })
        .catch((error) => console.log(error, 'Usuario no encontrado'));
});

//----------------------------
//-Actualizar Nombre Categoria 
//----------------------------

app.put('/categoria/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Categoria.findByIdAndUpdate(id, body, { new: true, runvalidator: true })
        .then((resultado) => {
            res.json({
                ok: true,
                message: 'Categoria modificada con Exito !!!!!'
            })
            return console.log('Categoria modificada con exito!!!!!');
        })
        .catch((error) => console.log(error));

})

module.exports = app;