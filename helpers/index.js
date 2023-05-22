const dbValidators  = require ('./db-validators');
const generarJWT    = require ('./generarJWT');

module.exports = {
    ...dbValidators,
    ...generarJWT,
 
}