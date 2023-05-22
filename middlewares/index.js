//para que se puedan importar juntos todos los middlewares

const validarCampos = require('../middlewares/validar-campos');
const validarHorario = require('../middlewares/validar-horario');
const validarJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...validarHorario,
    ...validarJWT,
    ...validaRoles
}