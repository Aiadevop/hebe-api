const { response,json } = require("express");
const { Actividad } = require("../models");


//obtenerActividades

const obtenerActividades = async (req, res = response) => {
    try {

        const act = await Actividad.find()

        res.status(200).json({
            act
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}

//obtenerActividad- populate {}

const obtenerActividad = async (req, res = response) => {
    const { id } = req.params;
    try {
        const actividad = await Actividad.findById(id);
        if (!actividad) {
            res.status(400).json({
                message: `El id de esta actividad no existe.`
            })
            return;
        }
        res.status(200).json({
            actividad
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }

}

const crearActividad = async (req, res = response) => {

    const { precio } = req.body;
    const actividad = req.body.actividad.toUpperCase();
    try {
        const actividadDB = await Actividad.findOne({ actividad })


        if (actividadDB) {
            res.status(400).json({
                message: `La actividad ya existe en la BD`
            })
            return
        };
        const data = {
            actividad,
            precio
        }


        const actividadx = new Actividad(data);
        await actividadx.save(actividadx);
        res.status(200).json(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}


//Actualizaractividad - recibir el nombre

const actualizarActividad = async (req, res = response) => {

    const { id } = req.params;
    const { ...resto } = req.body;
    try {
        if (resto.actividad) {
            resto.actividad = resto.actividad.toUpperCase();
        }

        //encuentra una actividad y lo actualiza
        const actividades = await Actividad.findByIdAndUpdate(id, resto);

        res.status(200).json({
            "Actividad actualizada": actividades.actividad
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }
}

//BorrarActividad - estado false

const borrarActividad = async (req, res = response) => {

    const { id } = req.params;
    try {
        const { actividad } = await Actividad.findByIdAndDelete(id);

        res.json({
            "Actividad borrada": actividad
        })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al agregar el usuario al horario.' });
    }

}



module.exports = {
    actualizarActividad,
    borrarActividad,
    crearActividad,
    obtenerActividad,
    obtenerActividades


}