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
exports.getModeloBD = void 0;
const { DependenciaM, EstadoIncidenteM, IncidenteM, RoleM, TipoDocumentoM, TipoIncidenteM, UsuarioM, } = require("../models/MongoDB/index");
const dependencia_1 = __importDefault(require("../models/MySQL/dependencia"));
const estadoIncidente_1 = __importDefault(require("../models/MySQL/estadoIncidente"));
const incidente_1 = __importDefault(require("../models/MySQL/incidente"));
const role_1 = __importDefault(require("../models/MySQL/role"));
const tipoDocumento_1 = __importDefault(require("../models/MySQL/tipoDocumento"));
const tipoIncidente_1 = __importDefault(require("../models/MySQL/tipoIncidente"));
const usuario_1 = __importDefault(require("../models/MySQL/usuario"));
const getModeloBD = (modelo, payload, basedeDatos) => __awaiter(void 0, void 0, void 0, function* () {
    let modeloRespuesta;
    switch (basedeDatos) {
        case "MONGO":
            switch (modelo) {
                case "dependencia":
                    modeloRespuesta = yield DependenciaM.findOne(payload);
                    break;
                case "estadoIncidente":
                    modeloRespuesta = yield EstadoIncidenteM.findOne(payload);
                    break;
                case "incidente":
                    modeloRespuesta = yield IncidenteM.findOne(payload);
                    break;
                case "role":
                    modeloRespuesta = yield RoleM.findOne(payload);
                    break;
                case "tipoDocumento":
                    modeloRespuesta = yield TipoDocumentoM.findOne(payload);
                    break;
                case "tipoIncidente":
                    modeloRespuesta = yield TipoIncidenteM.findOne(payload);
                    break;
                case "usuario":
                    modeloRespuesta = yield UsuarioM.findOne(payload);
                    break;
                default:
                    break;
            }
            break;
        case "MYSQL":
            switch (modelo) {
                case "dependencia":
                    modeloRespuesta = yield dependencia_1.default.findOne(payload);
                    break;
                case "estadoIncidente":
                    modeloRespuesta = yield estadoIncidente_1.default.findOne(payload);
                    break;
                case "incidente":
                    modeloRespuesta = yield incidente_1.default.findOne(payload);
                    break;
                case "role":
                    modeloRespuesta = yield role_1.default.findOne(payload);
                    break;
                case "tipoDocumento":
                    modeloRespuesta = yield tipoDocumento_1.default.findOne(payload);
                    break;
                case "tipoIncidente":
                    modeloRespuesta = yield tipoIncidente_1.default.findOne(payload);
                    break;
                case "usuario":
                    modeloRespuesta = yield usuario_1.default.findOne(payload);
                    break;
                default:
                    break;
            }
            break;
        default:
            break;
    }
    return modeloRespuesta;
});
exports.getModeloBD = getModeloBD;
