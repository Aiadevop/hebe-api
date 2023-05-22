const { response } = require("express")

const esAdminRole = (req, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            message: "Se quiere verificar el role sin validar el token."
        });
    }
    const { rol, nombre } = req.usuario;
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            message: `El rol ${rol} no tiene permiso para borrar usuarios.`
        });

    }
    next();
}

const tieneRole = (...roles) => {

    return (req, res = response, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                message: "Se quiere verificar el role sin validar el token."
            });
        }

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                message: `El servicio requiere uno de estos roles: ${roles}`
            });
        }
        console.log(req.usuario.rol, " ha borrado el usuario.");
        next();


    }
}

module.exports = {
    esAdminRole,
    tieneRole
}