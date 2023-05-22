const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generarJWT');
const { buscarUsuarios } = require('./buscar.controller');
const { Agenda, Horario, Actividad } = require('../models');

const login = async (req, res = response) => {

    const { correo, password } = req.body;
    const url = 'http://localhost:8080/'
    let horarioUsuario = []
    let totalPrecio = 0
    let dia = " "
    let desde = " "
    let hasta = " "
    let nombreActividad = " "
    let precio = " "

    try {

        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        const idUser = usuario._id
        if (idUser) {
            let agendas = await Agenda.find({ "usuario": idUser })
            for (let i = 0; i < agendas.length; i++) {
                const horarioId = agendas[i].horario;
                let horarioAgenda = await Horario.findById({ "_id": horarioId })
                if (horarioAgenda) {
                    dia = horarioAgenda.dia
                    desde = horarioAgenda.desde
                    hasta = horarioAgenda.hasta
                }
                const idActividad = horarioAgenda.actividad.toString()
                console.log("idActividad: " + idActividad)
                let actividad = await Actividad.findById({ "_id": idActividad })
                if (!actividad) {
                    console.log("la actividad no existe")
                } else {

                    nombreActividad = actividad.actividad
                    precio = actividad.precio
                }
                horarioUsuario += "{ " + dia + " " + desde + " - " + hasta + " " + nombreActividad + " " + precio + "€ }" + "  <br/> "
                totalPrecio += precio

            }
        }

        if (!usuario) {
            return res.status(400).json({
                message: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está activo
        if (usuario.estado === false) { //!usuario.estado
            return res.status(400).json({
                message: 'Usuario / Password no son correctos - estado: false'
            });
        }

        // Verificar contraseña
        const contraseñaValida = bcryptjs.compareSync(password, usuario.password)
        if (!contraseñaValida) {
            return res.status(400).json({
                message: 'Usuario / Password no son correctos - contraseña'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);
        console.log(usuario.rol)



        res.status(200).json({
            message: 'Login ok',
            usuario,
            nombre: usuario.nombre,
            dni: usuario.dni,
            telefono: usuario.telefono,
            correo: usuario.correo,
            horarioUsuario,
            totalPrecio,
            rol:usuario.rol,
            token
        });


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Hable con el administrador'
        });
    }

}

module.exports = {
    login,

}