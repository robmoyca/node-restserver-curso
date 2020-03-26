const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//Este servicio va a mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    categorias
                });
            });
        });
});

//Este servicio va a buscar unac ategoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(...)

    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            res.json({
                ok: true,
                err: { message: 'Categoria no encontrada' }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });


});

//Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //necesito el id del usuario con el token valido, se encuentra en
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//Actualizar una nueva categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    //regresa la nueva categoria
    //necesito el id del usuario con el token valido, se encuentra en
    //req.usuario._id
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });


    });




});

//Borrar una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //Solo el administrador puede borrar categoria
    //Categoria findidandremove
    let id = req.params.id
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });


    });


});

module.exports = app;