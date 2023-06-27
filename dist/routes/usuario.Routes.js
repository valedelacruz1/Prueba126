"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const validar_campos_1 = require("../middlewares/validar-campos");
const db_validators_1 = require("../helpers/db-validators");
const usuario_controller_1 = require("../controllers/usuario.controller");
const router = (0, express_1.Router)();
//Obtener todos los usuarios registrados
router.get("/", usuario_controller_1.getUsuarios);
router.get("/:id", usuario_controller_1.getUsuario);
router.post("/", [
    (0, express_validator_1.check)("nombre", "El nombre es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("correo", "El correo no es valido").isEmail(),
    (0, express_validator_1.check)("password", "Password no es obligatorio y mas de 6 caracteres").isLength({ min: 6 }),
    (0, express_validator_1.check)("roleId", "No es un rol valido").custom(db_validators_1.esRoleValido),
    validar_campos_1.validarCampos,
], usuario_controller_1.crearUsuario);
router.put("/:id", [
    validar_jwt_1.default,
    (0, express_validator_1.check)("id", "El usuario no existe").custom(db_validators_1.existeUsuarioPorId),
    validar_campos_1.validarCampos
], usuario_controller_1.actualizarUsuario);
// router.delete("/:id", eliminarUsuario);
router.delete("/:id", [
    validar_jwt_1.default,
    (0, express_validator_1.check)("id").custom(db_validators_1.existeUsuarioPorId),
    // check()
], usuario_controller_1.borrarUsuarioPermanente);
exports.default = router;
