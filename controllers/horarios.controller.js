const { response, json } = require("express");
const { Horario, Actividad, Usuario } = require("../models");
const mongoose = require('mongoose');
const { findById } = require("../models/horario");
const { Schema } = mongoose;

//obtenerHorarios - paginado - nºHorarios - metodo populate

const obtenerHorarios = async (req, res = response) => {

    const { limite = 100, desde = 0 } = req.query;
    const cat = Horario.find({ estado: true })
        // .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite));
    const tot = Horario.countDocuments({ estado: true });

    const [total, horarios] = await Promise.all([
        tot,
        cat
    ])

    res.status(200).json({
        total,
        horarios
    })
}

//obtenerHorario- populate {}

const obtenerHorario = async (req, res = response) => {
    const { id } = req.params;
    try {
        const horario = await Horario.findById(id);
        const idActividad = horario.actividad.toString()
        const actividad = await Actividad.findById(idActividad)
        if (!actividad) {
            res.status(200).json({
                horario
            })
        }
        console.log(actividad)
        const nombreActividad = actividad.nombre

        res.status(200).json({
            horario,
            nombreActividad
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Contacte con el administrador.' });
    }
}

const crearHorario = async (req, res = response) => {

    const { dia, desde, hasta, sala, actividad } = req.body;

    try {
        if (!dia || !desde || !hasta || !sala) {
            res.status(400).json({
                message: "Faltan campos por rellenar"
            })
        }      

     
        const horarioDB = await Horario.findOne({ dia, desde, hasta, sala })

        if (horarioDB) {
            console.log('ocupada')
            res.status(400).json({
                message: "La sala ya está ocupada"
            })
            return;
        }
        const actividadDB = await Actividad.findById(actividad)
        const nombreActividad = actividadDB.actividad

        const data = {
            dia,
            desde,
            hasta,
            sala,
            actividad,
            nombreActividad
        }
        console.log(data)
        const horario = new Horario(data)
        console.log(horario)
        await horario.save(horario);
        res.status(200).json({
            "Horario creado": horario
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Contacte con el administrador.' });
    }
}

//ActualizarHorario - recibir el nombre

const actualizarHorario = async (req, res = response) => {

    const { id } = req.params;
    const { estado, ...resto } = req.body;
    try {
        //encuentra una horario y lo actualiza
        const horarios = await Horario.findByIdAndUpdate(id, resto, { new: true });

        res.status(200).json({
            horarios
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Contacte con el administrador.' });
    }
}

//Añadir usuario al horario.

const añadirUsuarioAlHorario = async (req, res = response) => {

    const { id } = req.params;
    const { usuario } = req.body;

    try {
        const horarioDB = await Horario.findById(id);
        if (!horarioDB) {
            res.status(400).json({
                message: `El horario no existe.`
            })
            return;
        }

        const usuarioDB = await Usuario.findById(usuario)
        if (!usuarioDB) {
            res.status(400).json({
                message: `El usuario no existe.`
            })
            return;
        }

        const usuarioHorarioDB = await Horario.findOne({ '_id': id, 'usuario': usuario })
        if (usuarioHorarioDB) {
            res.status(400).json({
                message: `El usuario ya esta registrado en este horario`
            })
            return;
        };

        //encuentra una actividad y lo actualiza
        // const actividades = await Actividad.findByIdAndUpdate(id,usuario,{new:true});
        horarioDB.usuario.push(usuario);
        await horarioDB.save();

        res.status(200).json({
            horarioDB
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}

//Borrar usuario de la actividad
const borrarUsuarioDelHorario = async (req, res = response) => {

    const { id } = req.params;
    const { usuario } = req.body;

    try {
        const actividadDB = await Actividad.findById(id);
        if (!actividadDB.usuario.includes(usuario)) {
            res.status(400).json({
                message: `El usuario no esta registrado en esta actividad`
            })
            return
        };

        //encuentra una actividad y lo actualiza
        // const actividades = await Actividad.findByIdAndUpdate(id,usuario,{new:true});
        actividadDB.usuario.pull(usuario);
        await actividadDB.save();

        res.status(200).json({
            actividadDB
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario a la actividad.' });
    }
}


//BorrarHorario - estado false

const borrarHorario = async (req, res = response) => {

    const { id } = req.params;
    try {
        const { horario } = await Horario.findByIdAndDelete(id);

        res.json({
            "Horario borrado": horario
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario a la actividad.' });
    }



}

module.exports = {
    actualizarHorario,
    borrarHorario,
    crearHorario,
    obtenerHorario,
    obtenerHorarios,
    añadirUsuarioAlHorario,
    borrarUsuarioDelHorario,


}