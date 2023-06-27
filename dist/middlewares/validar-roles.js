"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esAdminRole = void 0;
const esAdminRole = (req, res, next) => {
    const { usuario } = req;
    if (!usuario) {
        return res.status(500).json({
            msg: 'Se quiere verificar rol sin validar token'
        });
    }
    console.log("req.usuari", usuario.roleId);
    if (usuario.roleId !== 1) {
        return res.status(401).json({
            msg: `${usuario.nombre} no es Administrador.`
        });
    }
    next();
};
exports.esAdminRole = esAdminRole;
