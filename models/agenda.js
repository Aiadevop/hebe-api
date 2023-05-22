const { Schema, model } = require('mongoose');

const AgendaSchema = Schema({

    horario: {
        type: Schema.Types.ObjectId,
        ref: 'Horario',  
        required:true 
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario', 
    }   
   

});

AgendaSchema.methods.toJSON = function() {

    //Se saca la versión y el password y todos los demás aparecen.
    const { __v, estado, ...agenda } = this.toObject();
    return agenda;
}

module.exports = model('Agenda', AgendaSchema)