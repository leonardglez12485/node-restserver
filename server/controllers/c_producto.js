const express = require('express');
const { verifyToken, verifyAdmin } = require('../middlewares/authenticatios');
const app = express();
let Producto = require('../models/producto');
let Categoria = require('../models/categoria');
const { where } = require('underscore');


//--------------------
//-Adicionar Producto
//--------------------

app.post('/producto', verifyToken, (req, res) => {
    let body = req.body;
    let user = req.User;
    let prod = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: user.usuario._id
    });

    prod.save()
        .then((prod, error) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            } else {
                res.json({
                    ok: true,
                    prod
                });
                return console.log('New Product added to DataBase !!!!!');
            }
        })
        .catch((error) => console.log(error));

});

//---------------------------
//-Obtener todos los Producto
//---------------------------
app.get('/producto', verifyToken, (req, res) => {
    let conteo = 0;
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 10;
    Producto.count({ 'disponible': true })
        .then((cont) => {
            conteo = cont;
        })
        .catch((error) => console.log(error));
    Producto.find({ 'disponible': true }, 'nombre precioUni descripcion')
        .sort('categoria')
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .then((prod) => {
            res.json({
                ok: true,
                prod,
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
//-Obtener un solo Producto 
//---------------------------

app.get('/producto/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .then((prod) => {
            res.json({
                ok: true,
                prod
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

//----------------------------
//-Actualizar Producto
//----------------------------

app.put('/producto/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    Producto.findByIdAndUpdate(id, body, { new: true, runvalidator: true })
        .then((prod) => {
            res.json({
                ok: true,
                message: 'Producto modificado con Exito !!!!!'
            })
            return console.log('Producto modificado con exito!!!!!');
        })
        .catch((error) => console.log(error));

});

//------------------
//-Eliminar Producto 
//------------------

app.delete('/producto/:id', [verifyToken, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true })
        .then((prod) => {
            res.json({
                ok: true,
                message: 'Producto Eliminado'
            })
        })
        .catch((error) => console.log(error, 'Producto no encontrado'));

});

//----------------
//-Buscar Producto
//----------------

app.get('/producto/buscar/:termino', verifyToken, (req, res) => {

    let termino = req.params.termino;
    let rexExp = new RegExp(termino, 'i')
    Producto.find({ nombre: rexExp })
        //console.log(termino)
        .populate('categoria', 'descripcion')
        .exec()
        .then((prod) => {
            res.json({
                ok: true,
                prod,
            })
        })
        .catch((error) => {
            res.status(500).json({
                ok: false,
                error
            });
        });


});


module.exports = app;