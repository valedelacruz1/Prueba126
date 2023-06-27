"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoDocumento_controller_1 = require("../controllers/tipoDocumento.controller");
const router = (0, express_1.Router)();
//Obtener todos los usuarios registrados
router.get("/", tipoDocumento_controller_1.getTipoDocumentos);
router.get("/:id", tipoDocumento_controller_1.getTipoDocumento);
router.post("/", tipoDocumento_controller_1.crearTipoDocumento);
// router.delete("/:id", borrarTipoDocumento);
router.delete("/:id", tipoDocumento_controller_1.borrarTipoDocumentoPermanente);
router.put("/:id", tipoDocumento_controller_1.actualizarTipoDocumento);
exports.default = router;
