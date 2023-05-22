//Mismo nombre que la colección sin la s.
//Çotejamos en la base de datos que lo introducido es correcto.

const { Schema, model } = require('mongoose');

const ActividadSchema = Schema({

    actividad: {
        type: String,
        required: [true, 'La actividad es obligatoria.']
    },
    precio: {
        type: Number,
        default:0
    }
});

ActividadSchema.methods.toJSON = function() {

    //Se saca la versión y el password y todos los demás aparecen.
    const { __v, ...actividad } = this.toObject();
    return actividad;
}

module.exports = model('Actividad', ActividadSchema)