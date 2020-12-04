const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// ===========================
// Mostrar todas la categorías
// ===========================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion') //sort recibe como parámetro el nombre del campo por la que requerimos que se ordenen los resultados
        .populate('usuario', 'nombre email') //populate recibe como parámetros el nombre de la colección y los nombres de los campos que queremos obtener de esa colección (el id del registro siempre se regresa por default)
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });
        });
});

// ===========================
// Mostrar una categoría por ID
// ===========================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoría no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoriaBD
        });
    });
});

// ===========================
// Crear nueva categoría
// ===========================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});
// ===========================
// Actualiza una categorías por ID
// ===========================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, useFindAndModify: false }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

// ===========================
// Eliminar una categoría por ID
// ===========================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Categoria.findOneAndRemove(id, { useFindAndModify: false }, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de categoría no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: `La categoría <${categoriaBD.descripcion}> ha sido eliminada exitosamente`
        });
    });

});


module.exports = app;