"use strict";
//TODO: definir rutas
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const { actualizarDependencia, borrarDependencia, borrarDependenciaPermanente, crearDependencia, getDependencia, getDependencias, } = require("../controllers/dependencia.controller");
const router = (0, express_1.Router)();
//Obtener todos las dependencias registrados
router.get("/", getDependencias);
router.get("/:id", getDependencia);
router.post("/", crearDependencia);
router.delete("/:id", borrarDependencia);
// router.delete("/:id", borrarDependenciaPermanente);
router.put("/:id", actualizarDependencia);
exports.default = router;
