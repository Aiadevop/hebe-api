//Modelo usuario

const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
const { uid } = require('../helpers/generarJWT');

console.log('test')

const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    dni:{
        type: String,
        required: [true, 'El dni es obligatorio']
    },
    telefono:{
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria.']
    }, 
     img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        enum: ['USER_ROLE','ADMIN_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    }

});

//Aquí podemos agregar o sobreescribir métodos, vamos a sobreescribir el método toJSON
//No puede ser una función de flecha si no, no funcionaría el this.
UsuarioSchema.methods.toJSON = function() {

    //Se saca la versión y el password y todos los demás aparecen.
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model('Usuario', UsuarioSchema);