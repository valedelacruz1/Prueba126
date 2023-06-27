"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validar_campos_1 = require("../middlewares/validar-campos");
const auth_controller_1 = require("../controllers/auth.controller");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const sendEmail_1 = require("../helpers/sendEmail");
const router = (0, express_1.Router)();
//Obtener todos las dependencias registrados
router.post("/login", [
    (0, express_validator_1.check)("username", "El username es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("password", "La contrasenia es obligatoria").not().isEmpty(),
    validar_campos_1.validarCampos,
], auth_controller_1.login);
// Validar y revalidar token de usuario 
router.get('/renew', validar_jwt_1.default, auth_controller_1.revalidarToken);
// Validar si ya expiro el token de usuario 
router.get('/expired', auth_controller_1.expiradoToken);
router.post('/sendEmail', validar_jwt_1.default, sendEmail_1.enviarMensajeReq);
exports.default = router;
