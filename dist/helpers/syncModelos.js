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
exports.actualizarSincronizacion = exports.insercionSincronizacion = void 0;
const { DependenciaM, EstadoIncidenteM, IncidenteM, RoleM, TipoDocumentoM, TipoIncidenteM, UsuarioM, } = require("../models/MongoDB/index");
const dependencia_1 = __importDefault(require("../models/MySQL/dependencia"));
const insercionSincronizacion = (tablaDestino, baseDeDatos, payload) => __awaiter(void 0, void 0, void 0, function* () {
    switch (baseDeDatos) {
        case "MYSQL":
            switch (tablaDestino) {
                case "dependencia":
                    // modeloRespuesta = await Dependencia.findOne(payload);
                    const dependenciaCreada = yield dependencia_1.default.create(payload);
                    //Actualizar el idmysql de la entidad que estaba en mongo
                    const dataMDB = Object.assign({ idMYSQL: dependenciaCreada.id }, dependenciaCreada);
                    const dependenciaMActualizada = yield DependenciaM.findOneAndUpdate(payload.id, dataMDB, {
                        new: true,
                    });
                    break;
                case "estadoIncidente":
                    // modeloRespuesta = await EstadoIncidente.findOne(payload);
                    break;
                case "incidente":
                    // modeloRespuesta = await Incidente.findOne(payload);
                    break;
                case "role":
                    // modeloRespuesta = await Role.findOne(payload);
                    break;
                case "tipoDocumento":
                    // modeloRespuesta = await TipoDocumento.findOne(payload);
                    break;
                case "tipoIncidente":
                    // modeloRespuesta = await TipoIncidente.findOne(payload);
                    break;
                case "usuario":
                    // modeloRespuesta = await Usuario.findOne(payload);
                    break;
                default:
                    break;
            }
            // const {idMYSQL,id,_id,...dependenciaFiltrada}=dependencia;
            // const dependenciaCreada: any = await Dependencia.create(dependenciaFiltrada);
            break;
        case "MONGO":
            break;
        default:
            break;
    }
});
exports.insercionSincronizacion = insercionSincronizacion;
const actualizarSincronizacion = (tablaDestino, baseDeDatos, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = payload.id;
    // const dependenciaActualizada
});
exports.actualizarSincronizacion = actualizarSincronizacion;
