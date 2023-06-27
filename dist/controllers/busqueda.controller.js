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
exports.buscar = void 0;
const { UsuarioM, IncidenteM, } = require("../models/MongoDB/index");
const incidente_1 = __importDefault(require("../models/MySQL/incidente"));
const usuario_1 = __importDefault(require("../models/MySQL/usuario"));
const tipoIncidente_1 = __importDefault(require("../models/MySQL/tipoIncidente"));
const estadoIncidente_1 = __importDefault(require("../models/MySQL/estadoIncidente"));
const role_1 = __importDefault(require("../models/MySQL/role"));
const dependencia_1 = __importDefault(require("../models/MySQL/dependencia"));
const tipoDocumento_1 = __importDefault(require("../models/MySQL/tipoDocumento"));
const getModelo_1 = require("../helpers/getModelo");
const coleccionesPermitidas = [
    "incidentesTipoEstado",
    "incidentesUsuario",
    "usuariosDependencia",
    "usuariosRole"
];
const getIncidentesPorUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: idUsuario } = req.params;
    let { tipoIncidente = 0, estadoIncidente = 0, estado = true } = req.query;
    let estadoIncidenteVal = Number(estadoIncidente);
    let idTipoIncidente = Number(tipoIncidente);
    let estadoVal = Boolean(estado);
    const payloadUsuario = {
        idMYSQL: idUsuario,
    };
    const usuarioM = yield (0, getModelo_1.getModeloBD)("usuario", payloadUsuario, "MONGO");
    let query, queryMongo, payloadEstadoIncidente, payloadTipoIncidente, estadoIncidenteM, tipoIncidenteM;
    if (idTipoIncidente > 0 && estadoIncidenteVal > 0) {
        payloadTipoIncidente = {
            idMYSQL: idTipoIncidente,
        };
        payloadEstadoIncidente = {
            idMYSQL: estadoIncidenteVal,
        };
        tipoIncidenteM = yield (0, getModelo_1.getModeloBD)("tipoIncidente", payloadTipoIncidente, "MONGO");
        estadoIncidenteM = yield (0, getModelo_1.getModeloBD)("estadoIncidente", payloadEstadoIncidente, "MONGO");
        query = {
            inc_estado: estadoVal,
            inc_usuarioId: idUsuario,
            inc_estadoIncidenteId: estadoIncidenteVal,
            inc_tipoIncidenteId: idTipoIncidente,
        };
        queryMongo = {
            inc_estado: estadoVal,
            inc_usuario: usuarioM.id,
            inc_estadoIncidente: estadoIncidenteM.id,
            inc_tipoIncidente: tipoIncidenteM.id,
        };
    }
    else if (idTipoIncidente === 0 && estadoIncidenteVal === 0) {
        query = {
            inc_estado: true,
            inc_usuarioId: idUsuario,
        };
        queryMongo = {
            inc_estado: true,
            inc_usuario: usuarioM.id,
        };
        console.log('queryMYSQL', query);
        console.log('queryMONGO', queryMongo);
    }
    else if (idTipoIncidente === 0 && estadoIncidenteVal > 0) {
        payloadEstadoIncidente = {
            idMYSQL: estadoIncidenteVal,
        };
        estadoIncidenteM = yield (0, getModelo_1.getModeloBD)("estadoIncidente", payloadEstadoIncidente, "MONGO");
        query = {
            inc_estado: estadoVal,
            inc_usuarioId: idUsuario,
            inc_estadoIncidenteId: estadoIncidenteVal,
        };
        queryMongo = {
            inc_estado: estadoVal,
            inc_usuario: usuarioM.id,
            inc_estadoIncidente: estadoIncidenteM.id,
        };
    }
    else if (idTipoIncidente > 0 && estadoIncidenteVal === 0) {
        payloadTipoIncidente = {
            idMYSQL: idTipoIncidente,
        };
        tipoIncidenteM = yield (0, getModelo_1.getModeloBD)("tipoIncidente", payloadTipoIncidente, "MONGO");
        query = {
            inc_estado: estadoVal,
            inc_usuarioId: idUsuario,
            inc_tipoIncidenteId: idTipoIncidente,
        };
        queryMongo = {
            inc_estado: estadoVal,
            inc_usuario: usuarioM.id,
            inc_tipoIncidente: tipoIncidenteM.id,
        };
    }
    try {
        //Buscar todas los incidentes
        //MYSQL
        const [totalMYSQL, incidentesMy] = yield Promise.all([
            incidente_1.default.count({ where: query }),
            incidente_1.default.findAll({
                where: query,
                include: [
                    {
                        model: usuario_1.default,
                        as: "inc_usuario",
                        required: true,
                        attributes: [
                            "id",
                            "nombre",
                            "correo",
                            "telefono",
                            "dependenciaId",
                            "roleId",
                        ],
                    },
                    {
                        model: usuario_1.default,
                        as: "inc_usuarioRevision",
                        required: true,
                        attributes: ["id", "nombre", "correo", "roleId"],
                    },
                    {
                        model: tipoIncidente_1.default,
                        as: "inc_tipoIncidente",
                        required: true,
                        attributes: ["id", "tinc_nombre", "tinc_descripcion"],
                    },
                    {
                        model: estadoIncidente_1.default,
                        as: "inc_estadoIncidente",
                        required: true,
                        attributes: ["id", "est_nombre", "est_descripcion"],
                    },
                ],
            }),
        ]);
        //MONGODB
        const [totalMongoDB, incidentesMo] = yield Promise.all([
            IncidenteM.countDocuments(queryMongo),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            IncidenteM.find(queryMongo)
                .populate("inc_usuario", [
                "id",
                "nombre",
                "correo",
                "telefono",
                "idMYSQL",
                "dependencia",
                "role",
            ])
                .populate("inc_usuarioRevision", [
                "id",
                "nombre",
                "correo",
                "idMYSQL",
                "role",
            ])
                .populate("inc_tipoIncidente", [
                "id",
                "idMYSQL",
                "tinc_nombre",
                "tinc_descripcion",
            ])
                .populate("inc_estadoIncidente", [
                "id",
                "idMYSQL",
                "est_nombre",
                "est_descripcion",
            ]),
        ]);
        if (!incidentesMo || !incidentesMy) {
            return res.status(400).json({
                msg: `No hay Incidencias registradas en la base de datos`,
            });
        }
        return res.status(200).json({
            msg: "get API -getIncidentesPorUsuario",
            totalMYSQL,
            incidentesMy,
            totalMongoDB,
            incidentesMo,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador",
            //BDSTATUS
        });
    }
});
const getIncidentesPorTipoEstado = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let { estadoIncidente = 0, estado = true } = req.query;
    const idTipoIncidente = Number(id);
    let estadoIncidenteVal = Number(estadoIncidente);
    let estadoVal = Boolean(estado);
    let query, queryMongo, payloadEstadoIncidente, payloadTipoIncidente, estadoIncidenteM, tipoIncidenteM;
    if (idTipoIncidente > 0 && estadoIncidenteVal > 0) {
        payloadTipoIncidente = {
            idMYSQL: idTipoIncidente,
        };
        payloadEstadoIncidente = {
            idMYSQL: estadoIncidenteVal,
        };
        tipoIncidenteM = yield (0, getModelo_1.getModeloBD)("tipoIncidente", payloadTipoIncidente, "MONGO");
        estadoIncidenteM = yield (0, getModelo_1.getModeloBD)("estadoIncidente", payloadEstadoIncidente, "MONGO");
        query = {
            inc_estado: estadoVal,
            inc_tipoIncidenteId: idTipoIncidente,
            inc_estadoIncidenteId: estadoIncidenteVal,
        };
        queryMongo = {
            inc_estado: estadoVal,
            inc_tipoIncidente: tipoIncidenteM.id,
            inc_estadoIncidente: estadoIncidenteM.id,
        };
    }
    else if (idTipoIncidente > 0 && estadoIncidenteVal == 0) {
        payloadTipoIncidente = {
            idMYSQL: idTipoIncidente,
        };
        tipoIncidenteM = yield (0, getModelo_1.getModeloBD)("tipoIncidente", payloadTipoIncidente, "MONGO");
        query = {
            inc_estado: estadoVal,
            inc_tipoIncidenteId: idTipoIncidente,
        };
        queryMongo = {
            inc_estado: estadoVal,
            inc_tipoIncidente: tipoIncidenteM.id,
        };
    }
    else if (idTipoIncidente == 0 && estadoIncidenteVal == 0) {
        query = {
            inc_estado: estadoVal,
        };
        queryMongo = {
            inc_estado: estadoVal,
        };
    }
    try {
        //Buscar todas los incidentes
        //MYSQL
        const [totalMYSQL, incidentesMy] = yield Promise.all([
            incidente_1.default.count({ where: query }),
            incidente_1.default.findAll({
                where: query,
                include: [
                    {
                        model: usuario_1.default,
                        as: "inc_usuario",
                        required: true,
                        attributes: [
                            "id",
                            "nombre",
                            "correo",
                            "telefono",
                            "dependenciaId",
                            "roleId",
                        ],
                    },
                    {
                        model: usuario_1.default,
                        as: "inc_usuarioRevision",
                        required: true,
                        attributes: ["id", "nombre", "correo", "roleId"],
                    },
                    {
                        model: tipoIncidente_1.default,
                        as: "inc_tipoIncidente",
                        required: true,
                        attributes: ["id", "tinc_nombre", "tinc_descripcion"],
                    },
                    {
                        model: estadoIncidente_1.default,
                        as: "inc_estadoIncidente",
                        required: true,
                        attributes: ["id", "est_nombre", "est_descripcion"],
                    },
                ],
            }),
        ]);
        //MONGODB
        const [totalMongoDB, incidentesMo] = yield Promise.all([
            IncidenteM.countDocuments({
                inc_estado: true,
                inc_tipoIncidente: tipoIncidenteM.id,
                inc_estadoIncidente: estadoIncidenteM.id,
            }),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            IncidenteM.find(queryMongo)
                .populate("inc_usuario", [
                "idMYSQL",
                "nombre",
                "correo",
                "telefono",
                "dependencia",
                "role",
            ])
                .populate("inc_usuarioRevision", [
                "idMYSQL",
                "nombre",
                "correo",
                "role",
            ])
                .populate("inc_tipoIncidente", [
                "idMYSQL",
                "tinc_nombre",
                "tinc_descripcion",
            ])
                .populate("inc_estadoIncidente", [
                "idMYSQL",
                "est_nombre",
                "est_descripcion",
            ]),
        ]);
        if (!incidentesMo || !incidentesMy) {
            return res.status(400).json({
                msg: `No hay Incidencias registradas en la base de datos`,
            });
        }
        return res.status(200).json({
            msg: "get API -getIncidencias",
            totalMYSQL,
            incidentesMy,
            totalMongoDB,
            incidentesMo,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador",
            //BDSTATUS
        });
    }
});
const getUsuariosPorDependencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: idDependencia } = req.params;
    let { estado = true } = req.query;
    let estadoVal = Boolean(estado);
    const payloadDependencia = {
        idMYSQL: idDependencia,
    };
    //Obtener la dependencia MYSQL
    let dependencia = yield (0, getModelo_1.getModeloBD)("dependencia", payloadDependencia, "MYSQL");
    let dependenciaM = yield (0, getModelo_1.getModeloBD)("dependencia", payloadDependencia, "MONGO");
    if (!dependencia) {
        return res.status(404).json({
            msg: `No se encontro dependencia con el id ${idDependencia} en base de datos MYSQL`,
        });
    }
    else if (!dependenciaM) {
        return res.status(404).json({
            msg: `No se encontro dependencia con el id ${idDependencia} en base de datos MONGODB`,
        });
    }
    console.log(dependenciaM);
    let query, queryMongo;
    if (Number(idDependencia) !== 0 && estadoVal !== undefined) {
        query = {
            estado: estadoVal,
            dependenciaId: idDependencia,
        };
        queryMongo = {
            estado: estadoVal,
            dependencia: dependenciaM.id,
        };
    }
    try {
        //Buscar todas los incidentes
        //MYSQL
        const [totalMYSQL, usuariosMy] = yield Promise.all([
            usuario_1.default.count({ where: query }),
            usuario_1.default.findAll({
                where: query,
                include: [
                    {
                        model: role_1.default,
                        as: "role",
                        required: true,
                        attributes: ["id", "rol_nombre", "rol_descripcion"],
                    },
                    {
                        model: dependencia_1.default,
                        as: "dependencia",
                        required: true,
                        attributes: ["id", "dep_nombre", "dep_descripcion"],
                    },
                    {
                        model: tipoDocumento_1.default,
                        as: "tipoDocumento",
                        required: true,
                        attributes: ["id", "tdoc_nombre", "tdoc_descripcion"],
                    },
                ],
            }),
        ]);
        //MONGODB
        const [totalMongoDB, usuariosMo] = yield Promise.all([
            UsuarioM.countDocuments(queryMongo),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            UsuarioM.find(queryMongo)
                .populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "])
                .populate("dependencia", [
                "idMYSQL",
                "dep_nombre",
                "dep_descripcion",
                "role",
            ])
                .populate("tipoDocumento", [
                "idMYSQL",
                "tdoc_nombre",
                "tdoc_descripcion",
            ]),
        ]);
        if (!usuariosMy || !usuariosMo) {
            return res.status(400).json({
                msg: `No hay usuarios registrados en la base de datos`,
            });
        }
        res.status(200).json({
            msg: "get API -getUsuarios",
            totalMYSQL,
            usuariosMy,
            totalMongoDB,
            usuariosMo,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //BDSTATUS
        });
    }
});
const getUsuariosPorRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: idRole } = req.params;
    let { estado = true } = req.query;
    let estadoVal = Boolean(estado);
    const payloadRole = {
        idMYSQL: idRole,
    };
    //Obtener la dependencia MYSQL
    let role = yield (0, getModelo_1.getModeloBD)("role", payloadRole, "MYSQL");
    let roleM = yield (0, getModelo_1.getModeloBD)("role", payloadRole, "MONGO");
    if (!role) {
        return res.status(404).json({
            msg: `No se encontro role con el id ${idRole} en base de datos MYSQL`,
        });
    }
    else if (!roleM) {
        return res.status(404).json({
            msg: `No se encontro role con el id ${idRole} en base de datos MONGODB`,
        });
    }
    console.log(roleM);
    let query, queryMongo;
    if (Number(idRole) !== 0 && estadoVal !== undefined) {
        query = {
            estado: estadoVal,
            roleId: idRole,
        };
        queryMongo = {
            estado: estadoVal,
            role: roleM.id,
        };
    }
    try {
        //Buscar todas los incidentes
        //MYSQL
        const [totalMYSQL, usuariosMy] = yield Promise.all([
            usuario_1.default.count({ where: query }),
            usuario_1.default.findAll({
                where: query,
                include: [
                    {
                        model: role_1.default,
                        as: "role",
                        required: true,
                        attributes: ["id", "rol_nombre", "rol_descripcion"],
                    },
                    {
                        model: dependencia_1.default,
                        as: "dependencia",
                        required: true,
                        attributes: ["id", "dep_nombre", "dep_descripcion"],
                    },
                    {
                        model: tipoDocumento_1.default,
                        as: "tipoDocumento",
                        required: true,
                        attributes: ["id", "tdoc_nombre", "tdoc_descripcion"],
                    },
                ],
            }),
        ]);
        //MONGODB
        const [totalMongoDB, usuariosMo] = yield Promise.all([
            UsuarioM.countDocuments(queryMongo),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            UsuarioM.find(queryMongo)
                .populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "])
                .populate("dependencia", [
                "idMYSQL",
                "dep_nombre",
                "dep_descripcion",
                "role",
            ])
                .populate("tipoDocumento", [
                "idMYSQL",
                "tdoc_nombre",
                "tdoc_descripcion",
            ]),
        ]);
        if (!usuariosMy || !usuariosMo) {
            return res.status(400).json({
                msg: `No hay usuarios registrados en la base de datos`,
            });
        }
        res.status(200).json({
            msg: "get API -getUsuarios",
            totalMYSQL,
            usuariosMy,
            totalMongoDB,
            usuariosMo,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //BDSTATUS
        });
    }
});
const buscar = (req, res) => {
    const { coleccion } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
        });
    }
    switch (coleccion) {
        case "incidentesTipoEstado":
            getIncidentesPorTipoEstado(req, res);
            break;
        case "incidentesUsuario":
            getIncidentesPorUsuario(req, res);
            break;
        case "usuariosDependencia":
            console.log("entro usuarios dependencia");
            getUsuariosPorDependencia(req, res);
            break;
        case "usuariosRole":
            console.log("entro usuarios role");
            getUsuariosPorRole(req, res);
            break;
        default:
            return res.status(500).json({
                msg: "Se le olvido hacer esta busqueda",
            });
    }
};
exports.buscar = buscar;
