const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Para la paginación de la lista de usuarios
    Usuario.find({ estado: true /*Se pueden agregar parámetros para filtrar los resultados de acuerdo a su contenido (letra, palabra, etc)*/ }, 'nombre email role estado google img') //Para filtrar los campos que necesito que me regrese en la respuesta
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

app.put('/usuario/:id', function(req, res) { //:id es para indicar el parámetro que se recibe

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //Son las propiedades que si quiero que se puedan actualizar

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let cambiaEstado = { //Sólo quiero que cambie a false el valor del campo estado para el id especificado
        estado: false
    };

    //Usuario.findByIdAndRemove(id, (err, udusrioBorrado) => {}) //Con esta instrucción se realiza un borrado físico en BD
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true, runValidators: true }, (err, usuaiorBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuaiorBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuaiorBorrado
        });
    });

});

module.exports = app;