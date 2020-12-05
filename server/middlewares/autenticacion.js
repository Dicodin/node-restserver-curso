const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// ===================
// Verificar Token
// ===================

let verificaToken = (req, res, next) => { //next es para indicar que el código se seguirá ejecutando despues de llamar al middleware
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => { //decoded es el payload con la información decodificada del token
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

// ===================
// Verificar AdminRole
// ===================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

// ===================
// Verificar Token para imagenes
// ===================

let verificaTokenImg = (req, res, next) => { //next es para indicar que el código se seguirá ejecutando despues de llamar al middleware
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => { //decoded es el payload con la información decodificada del token
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};