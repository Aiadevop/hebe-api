const { Router } = require('express');
const { check } = require('express-validator');

//esto es equivalente a lo de arriba con el index.
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares') //esto apunta al index de los middlewares

// const { esRoleValido, emailExiste, idExiste } = require('../helpers/db-validators');

const { emailExiste, idExiste } = require('../helpers/db-validators');

const {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
} = require('../controllers/usuarios.controller');

const router = Router();

router.get('/auth/', usuariosGet);

//Nuevos recursos: ej. usuario creado
//si router.post{opc1(ruta,controlador) / opc2(ruta,middleware,controlador)}
router.post('/auth/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('dni', 'El dni es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8 }),
    check('rol', 'El rol no es correcto').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('correo').custom(emailExiste),
    validarCampos,
], usuariosPost);

//Actualizar DATA: ej. datos actualizados
router.put('/auth/:id', [
        //middlewares
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(idExiste), 
        // check('rol'),
        validarCampos
    ],
    usuariosPut);


//Borra algo
router.delete('/auth/:id', [
    // validarJWT,
    //esAdminRole, (esto solo vale para AdminRole si queremos + variables distinto middleware, el de abajo.)
    // tieneRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(idExiste),
    validarCampos
], usuariosDelete);

//Ruta
//router.patch('/', usuariosPatch);

module.exports = router;