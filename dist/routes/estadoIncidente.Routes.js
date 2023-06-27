"use strict";
//TODO: definir rutas
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estadoIncidente_controller_1 = require("../controllers/estadoIncidente.controller");
const router = (0, express_1.Router)();
//Obtener todos los usuarios registrados
router.get("/", estadoIncidente_controller_1.getEstadoIncidentes);
router.get("/:id", estadoIncidente_controller_1.getEstadoIncidente);
router.post("/", estadoIncidente_controller_1.crearEstadoIncidente);
router.put("/:id", estadoIncidente_controller_1.actualizarEstadoIncidente);
// router.delete("/:id", borrarEstadoIncidente);
router.delete("/:id", estadoIncidente_controller_1.borrarEstadoIncidentePermanente);
exports.default = router;
