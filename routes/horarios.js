const { Router, response } = require('express');
const { check } = require('express-validator');
const { 
    crearHorario, 
    obtenerHorario, 
    obtenerHorarios, 
    actualizarHorario,
    añadirUsuarioAlHorario,
    borrarHorario } = require('../controllers/horarios.controller');
const { existeHorario} = require('../helpers/db-validators');


const {
    validarCampos,
    validarJWT,
    tieneRole
} = require('../middlewares')

const router = Router();

//{{url}}/api/Horarios

//Obtener todas las Horarios-publico
router.get('/auth/', [
    
],obtenerHorarios);

//Obtener una Horario por id - publico.
router.get('/auth/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check ('id').custom(existeHorario),
    validarCampos
],obtenerHorario);

//Crear horario - privado con cualquier persona con token valido.
router.post('/auth/', [
    // validarJWT,
    check('dia', 'El dia es obligatorio.').not().isEmpty(),
    check('desde', 'El desde es obligatorio.').not().isEmpty(),
    check('hasta', 'El hasta es obligatorio.').not().isEmpty(),
    check('sala', 'La sala es obligatoria.').not().isEmpty(),
    check('actividad', 'La actividad es obligatoria.').not().isEmpty(),
    check('actividad', 'La actividad no tiene un id valido.').isMongoId(),
    validarCampos
], crearHorario);

//Actualizar -privado-cualquiera con token válido
router.put('/auth/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check ('id').custom(existeHorario),
    validarCampos
],actualizarHorario);

//Borrar Horario - Admin
router.delete('/auth/:id', [
    // validarJWT,   
    // tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check ('id').custom(existeHorario),
    validarCampos
], borrarHorario);

module.exports = router;