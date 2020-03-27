const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

// Obtener Productos
app.get('/producto', verificaToken, (req, res) => {
    /*trae todos los productos
    populate usuario y categoria
    y paginado */
    let limite = Number(req.query.limite || 5);
    let desde = Number(req.query.desde || 0);
    let condicion = { disponible: true };
    Producto.find(condicion)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .sort('nombre')
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    cantidad: conteo,
                    productos
                });
            });
        });
});

// Obtener Productos por id
app.get('/producto/:id', verificaToken, (req, res) => {
    /*populate usuario y categoria*/
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        });

});

//Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    criterio = {
        nombre: regex
    };
    Producto.find(criterio)
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});


// Crear un nuevo producto
app.post('/producto', verificaToken, (req, res) => {
    /*grabar un usuario, grabar una categoria*/
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        disponible: true,
        descripcion: body.descripcion,
        categoria: body.idCategoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });



});

// actualizar un nuevo producto
app.put('/producto/:id', verificaToken, (req, res) => {
    /*grabar un usuario, grabar una categoria*/
    let id = req.params.id;
    let body = req.body;

    let cambios = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.idCategoria,
        disponible: body.disponible
    };
    Producto.findByIdAndUpdate(id, cambios, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// borrar un nuevo producto
app.delete('/producto/:id', verificaToken, (req, res) => {
    /*marcar el estado como borrado: disponible*/
    let id = req.params.id;

    let cambiaEstado = { disponible: false };
    Producto.findByIdAndUpdate(id, cambiaEstado, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            res.json({
                ok: true,
                err: { message: 'Producto no encontrado' }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });


});

module.exports = app;