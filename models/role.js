//Mismo nombre que la colección sin la s.
//Çotejamos en la base de datos que lo introducido es correcto.

const { Schema, model } = require('mongoose');

const RoleSchema = Schema({

    rol: {
        type: String,
        required: [true, 'El rol es obligatorio.']
    
    }

});

module.exports = model('Role', RoleSchema)