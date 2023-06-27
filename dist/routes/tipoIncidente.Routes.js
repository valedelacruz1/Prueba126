"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tipoIncidente_controller_1 = require("../controllers/tipoIncidente.controller");
const router = (0, express_1.Router)();
//Obtener todos los usuarios registrados
router.get("/", tipoIncidente_controller_1.getTipoIncidentes);
router.get("/:id", tipoIncidente_controller_1.getTipoIncidente);
router.post("/", tipoIncidente_controller_1.crearTipoIncidente);
// router.delete("/:id", borrarTipoIncidente);
router.delete("/:id", tipoIncidente_controller_1.borrarTipoIncidentePermanente);
router.put("/:id", tipoIncidente_controller_1.actualizarTipoIncidente);
exports.default = router;
