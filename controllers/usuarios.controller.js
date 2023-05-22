const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { Actividad } = require('../models');



const usuariosGet = async (req = request, res = response) => {

    //muestra todos los usuarios.
    const usu = await Usuario.find({ estado: true });

    try {

        // const { limite = 5, desde = 0 } = req.query;

        // const usu = Usuario.find({ estado: true }) //le puedo poner condiciones
        //     .skip(Number(desde))
        //     .limit(Number(limite)); //hay que transformar el limite a un numero pq siempre devuelve un String si lo escribimos.

        const tot = Usuario.countDocuments({ estado: true });


        //metemos las dos promesas en el mismo await para que se ejecuten
        //de manera simultanea y que no esperen la una por la otra.
        const [total, usuarios] = await Promise.all([
            tot,
            usu
        ])


        res.status(200).json({
            total,
            usuarios
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol, dni, telefono } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol, dni, telefono });

    try {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(10); //Que número de vueltas de seguridad se le quiere dar.
        usuario.password = bcryptjs.hashSync(password, salt); //encriptarlo en una sola vía.

        //Guardar en la BD
        await usuario.save(usuario);

        res.status(200).json({
            "Usuario creado": usuario
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}


//Actualización de datos de usuario.
const usuariosPut = async (req, res = response) => {

    //params.(nombre que se puso en la ruta.)
    const { id } = req.params;
    const {password, ...resto } = req.body;    
    try {
   
        //TO DO validar contra BD
        //Si nos marcan el password es pq quieren actualizar su contraseña
        if (password) {
            const salt = bcryptjs.genSaltSync(10); //Que número de vueltas de seguridad se le quiere dar.
            resto.password = bcryptjs.hashSync(password, salt);
        }

        //encuentra un usuario y lo actualiza
        const usuario = await Usuario.findByIdAndUpdate(id, resto);

        res.status(200).json({
            "Usuario actualizado": usuario
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;
    try {

        //Si queremos borrarlo físicamente.
        const usuario = await Usuario.findByIdAndDelete(id);

        res.status(200).json({

            "Usuario borrado": usuario,

        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}

const usuariosPatch = (req, res = response) => {
    res.json({
        "message": "patch API-Controlador"
    })
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPatch
}