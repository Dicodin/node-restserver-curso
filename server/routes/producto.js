const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');
const producto = require('../models/producto');

let app = express();

let Producto = require('../models/producto');

// ===========================
// Obtener todos los productos
// ===========================
app.get('/producto', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productosBD,
                    cuantos: conteo
                });
            });
        });
});

// ===========================
// Obtener un producto por ID
// ===========================
app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                productoBD
            });

        });
});

// ===========================
// Buscar productos
// ===========================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i'); //el parámetro i es para especificar que el término no sea sensible a mayus y minus

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productosBD
            })
        });
});

// ===========================
// Crear un nuevo producto
// ===========================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            productoBD
        });
    });
});

// ===========================
// Actualizar un producto
// ===========================
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    }

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            productoBD
        });
    });
});

// ===========================
// Borrar un producto
// ===========================
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let bodyProducto = {
        disponible: false,
        usuario: req.usuario._id
    }

    Producto.findByIdAndUpdate(id, bodyProducto, { new: true, runValidators: true, useFindAndModify: false }, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            productoBD,
            message: `El producto <${productoBD.nombre}> ha sido borrado exitosamente`
        });
    });

});

module.exports = app;