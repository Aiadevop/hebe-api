const { response } = require("express");
const Horario = require('../models/horario');


const validarHorario = async(req = request, res = response, next) => {

    const {horario} = req.body;
    if (!horario) {
        return res.status(401).json({
            message: 'Cree primero el horario'
        });
    }

    try {
        
        const horariox = await Horario.findById(horario);//.populate('horario');

        if (!horariox) {
            return res.status(401).json({
                message: 'Id de horario no existe'
            })
        }

        req.horario = horariox;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            message: 'Error de horario'
        })
        return;
    }

}
module.exports = {
    validarHorario
}