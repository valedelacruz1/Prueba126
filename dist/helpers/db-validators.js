"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coleccionesPermitidas = exports.existeDependenciaPorId = exports.existeTipoDocumentoPorId = exports.existeEstadoIncidentePorId = exports.existeTipoIncidentePorId = exports.existeIncidentePorId = exports.existeUsuarioPorId = exports.emailExiste = exports.esRoleValido = void 0;
const dependencia_1 = __importDefault(require("../models/MySQL/dependencia"));
const estadoIncidente_1 = __importDefault(require("../models/MySQL/estadoIncidente"));
const incidente_1 = __importDefault(require("../models/MySQL/incidente"));
const role_1 = __importDefault(require("../models/MySQL/role"));
const tipoIncidente_1 = __importDefault(require("../models/MySQL/tipoIncidente"));
const tipoDocumento_1 = __importDefault(require("../models/MySQL/tipoDocumento"));
const usuario_1 = __importDefault(require("../models/MySQL/usuario"));
const { DependenciaM, EstadoIncidenteM, IncidenteM, RoleM, TipoIncidenteM, TipoDocumentoM, UsuarioM, } = require("../models/MongoDB/index");
const esRoleValido = (id = 0) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        id: id,
    };
    let existeRol = yield role_1.default.findOne({ where: query });
    //Obtener la el rol MONGODB
    let existeRolMongo = yield RoleM.findOne({ idMYSQL: id });
    if (!existeRol || !existeRolMongo) {
        throw new Error(`El Rol ${id} no esta registrado en la BD`);
    }
});
exports.esRoleValido = esRoleValido;
const emailExiste = (correo = "") => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el correo existe
    const existeEmail = yield usuario_1.default.findOne({ where: { correo } });
    const existeEmailMongo = yield UsuarioM.findOne({ where: { correo } });
    if (existeEmail || existeEmailMongo) {
        throw new Error(`El Correo: ${correo} ya ha sido usado en la BD`);
    }
});
exports.emailExiste = emailExiste;
const existeUsuarioPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el correo existe
    const existeId = yield usuario_1.default.findOne({ where: { id } });
    const existeIdMongo = yield UsuarioM.findOne({ idMYSQL: id });
    if (!existeId || !existeIdMongo) {
        throw new Error(`El Usuario con id: ${id} no existe en la BD`);
    }
});
exports.existeUsuarioPorId = existeUsuarioPorId;
// Validadores de Incidente
const existeIncidentePorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el incidente existe
    const existeIncidente = yield incidente_1.default.findOne({ where: { id } });
    const existeIncidenteMongo = yield IncidenteM.findOne({ idMYSQL: id });
    if (!existeIncidente || !existeIncidenteMongo) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
});
exports.existeIncidentePorId = existeIncidentePorId;
// Validadores de TipoIncidente
const existeTipoIncidentePorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el tipoIncidente existe
    const existeTipoIncidente = yield tipoIncidente_1.default.findOne({ where: { id } });
    const existeTipoIncidenteMongo = yield TipoIncidenteM.findOne({
        idMYSQL: id,
    });
    if (!existeTipoIncidente || !existeTipoIncidenteMongo) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
});
exports.existeTipoIncidentePorId = existeTipoIncidentePorId;
// Validadores de EstadoIncidente
const existeEstadoIncidentePorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si el EstadoIncidente existe
    const existeEstadoIncidente = yield estadoIncidente_1.default.findOne({
        where: { id },
    });
    const existeEstadoIncidenteMongo = yield EstadoIncidenteM.findOne({
        idMYSQL: id,
    });
    if (!existeEstadoIncidente || !existeEstadoIncidenteMongo) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
});
exports.existeEstadoIncidentePorId = existeEstadoIncidentePorId;
// Validadores de tipoDocumento
const existeTipoDocumentoPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si la tipoDocumento existe
    const existeTipoDocumento = yield tipoDocumento_1.default.findOne({ where: { id } });
    const existeTipoDocumentoMongo = yield TipoDocumentoM.findOne({
        idMYSQL: id,
    });
    if (!existeTipoDocumento || !existeTipoDocumentoMongo) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
});
exports.existeTipoDocumentoPorId = existeTipoDocumentoPorId;
// Validadores de Dependencia
const existeDependenciaPorId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Verificar si la Dependencia existe
    const existeDependencia = yield dependencia_1.default.findOne({ where: { id } });
    const existeDependenciaMongo = yield DependenciaM.findOne({
        idMYSQL: id,
    });
    if (!existeDependencia || !existeDependenciaMongo) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
});
exports.existeDependenciaPorId = existeDependenciaPorId;
// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true;
};
exports.coleccionesPermitidas = coleccionesPermitidas;
