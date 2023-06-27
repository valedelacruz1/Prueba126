"use strict";
//TODO: definir rutas
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rol_controller_1 = require("../controllers/rol.controller");
const router = (0, express_1.Router)();
//Obtener todos las dependencias registrados
router.get("/", rol_controller_1.getRoles);
router.get("/:id", rol_controller_1.getRole);
router.post("/", rol_controller_1.crearRole);
router.delete("/:id", rol_controller_1.borrarRole);
router.put("/:id", rol_controller_1.actualizarRole);
exports.default = router;
