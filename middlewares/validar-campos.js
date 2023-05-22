const { validationResult } = require('express-validator');

//Al ser un middleware lleva un next que es la función que hay que llamar si este middleware pasa.
const validarCampos = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validarCampos
};