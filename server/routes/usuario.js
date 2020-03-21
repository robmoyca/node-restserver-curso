const express = require('express');

const bcrypt = require('bcrypt');

const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

app.get('/', function(req, res) {
    res.json('Hello World');
});

app.get('/usuario', function(req, res) {
    let desde = Number(req.query.desde || 0);
    let limite = Number(req.query.limite || 5);
    let condicion = { estado: true };
    Usuario.find(condicion, 'nombre email role google estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    usuarios
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

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //delete body.password;
    //delete body.google;

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

    //delete body.password;
    //delete body.google;
    //body.estado = false;

    let cambiaEstado = { estado: false };
    Usuario.findByIdAndUpdate(id, cambiaEstado, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            res.json({
                ok: true,
                err: { message: 'Usuario no encontrado' }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


    /*Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            res.json({
                ok: true,
                err: { message: 'Usuario no encontrado' }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });*/


});

module.exports = app;