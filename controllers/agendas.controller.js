const { response, json } = require("express");
const { Horario, Actividad, Usuario, Agenda } = require("../models");
const mongoose = require('mongoose');
const { Schema } = mongoose;

//Añadir usuario a la agenda.

const añadirUsuarioAlaAgenda= async (req, res = response) => {

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

        const usuarioHorarioDB = await Agenda.findOne({ 'horario': id, 'usuario': usuario })
        if (usuarioHorarioDB) {
            res.status(400).json({
                message: `El usuario ya esta registrado en este horario`
            })
            return;
        }; 

        const data = {
            horario: id,
            usuario
        }

        const agenda = new Agenda (data)
        await agenda.save();

        res.status(200).json({
            agenda
        })
    // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}

//Borrar usuario de la agenda
const borrarUsuarioDelHorario = async (req, res = response) => {

    const { id } = req.params;
    const {usuario} = req.body

    try {
        const existeEnLaAgenda = await Agenda.findOne ({'horario': id,'usuario': usuario});
        if (!existeEnLaAgenda) {
            res.status(400).json({
                message: `El usuario no esta registrado en este horario`
            })
            return
        };

        const usuarioAgendaDB = await Agenda.findByIdAndDelete(existeEnLaAgenda._id);
        res.status(200).json({
            "Usuario borrado del horario" :usuarioAgendaDB
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al borrar el usuario de la agenda.' });
    }
}

//Dar de baja al usuario
const borrarUsuarioDelaAgenda = async (req, res = response) => {

    const {usuario} = req.body
    const hayUsuario = true

    try {
        while(hayUsuario){
        const existeEnLaAgenda = await Agenda.findOne ({'usuario': usuario});
        if (!existeEnLaAgenda) {
            res.status(200).json({
                message: "Usuario borrado de la agenda."
            })
            return
        };

        await Agenda.findByIdAndDelete(existeEnLaAgenda._id);
    }

} catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al borrar el usuario de la agenda.' });
    }
}


module.exports = {
    añadirUsuarioAlaAgenda,
    borrarUsuarioDelaAgenda,
    borrarUsuarioDelHorario
}