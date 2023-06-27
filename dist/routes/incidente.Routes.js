"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const validar_campos_1 = require("../middlewares/validar-campos");
const incidente_controller_1 = require("../controllers/incidente.controller");
const express_validator_1 = require("express-validator");
const db_validators_1 = require("../helpers/db-validators");
const db_validators_2 = require("../helpers/db-validators");
const router = (0, express_1.Router)();
router.get("/", incidente_controller_1.getIncidentes);
router.get("/:id", [validar_jwt_1.default,
    (0, express_validator_1.check)("id").custom(db_validators_2.existeIncidentePorId),
    validar_campos_1.validarCampos], incidente_controller_1.getIncidente);
//REGISTRAR INCIDENTE
router.post("/", [
    validar_jwt_1.default,
    (0, express_validator_1.check)("inc_nombre", "El nombre es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("inc_usuarioId", "El usuario no existe").custom(db_validators_2.existeUsuarioPorId),
    (0, express_validator_1.check)("inc_tipoIncidenteId", "No es un Tipo Incidente valido").custom(db_validators_2.existeTipoIncidentePorId),
    validar_campos_1.validarCampos,
], incidente_controller_1.crearIncidente);
//ACTUALIZAR INCIDENTE
router.put("/:id", [
    validar_jwt_1.default,
    (0, express_validator_1.check)("id").custom(db_validators_2.existeIncidentePorId),
    (0, express_validator_1.check)("inc_usuarioRevisionId", "El usuario no existe").custom(db_validators_2.existeUsuarioPorId),
    (0, express_validator_1.check)("inc_estadoIncidenteId", "No es un estadoIncidente valido").custom(db_validators_1.existeEstadoIncidentePorId),
    validar_campos_1.validarCampos,
], incidente_controller_1.actualizarIncidente);
// router.delete("/:id", [], borrarIncidente);// desactivar incidente
router.delete("/:id", [validar_jwt_1.default, validar_campos_1.validarCampos], incidente_controller_1.borrarIncidentePermanente);
//Forma permanent
exports.default = router;
