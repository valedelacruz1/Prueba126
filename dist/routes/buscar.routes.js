"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const validar_campos_1 = require("../middlewares/validar-campos");
const busqueda_controller_1 = require("../controllers/busqueda.controller");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
router.get("/:coleccion/:id", [
    validar_jwt_1.default,
    (0, express_validator_1.check)("id", "El id a buscar es obligatorio").not().isEmpty(),
    validar_campos_1.validarCampos,
], busqueda_controller_1.buscar);
exports.default = router;
