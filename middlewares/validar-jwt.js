const { request } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {
    //Se ubica el jwt en el header de postman con nombre x-token
    //Para leer los headers tengo que leer la request.

    const token = req.header('x-token');
    console.log("Este es el token"+token);
    if (!token) {
        return res.status(401).json({
            message: 'No hay un token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                message: 'Token no válido - usuario no existe DB'
            })
        }

        // Verificar si el uid tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                message: 'Token no válido - usuario con estado: false'
            })
        }
        req.usuario = usuario;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            message: 'Token no válido'
        })
    }

}
module.exports = {
    validarJWT
}