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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrarIncidentePermanente = exports.borrarIncidente = exports.actualizarIncidente = exports.getIncidente = exports.getIncidentes = exports.crearIncidente = void 0;
const { UsuarioM, IncidenteM, TipoIncidenteM, EstadoIncidenteM, } = require("../models/MongoDB/index");
const incidente_1 = __importDefault(require("../models/MySQL/incidente"));
const usuario_1 = __importDefault(require("../models/MySQL/usuario"));
const tipoIncidente_1 = __importDefault(require("../models/MySQL/tipoIncidente"));
const estadoIncidente_1 = __importDefault(require("../models/MySQL/estadoIncidente"));
const MySQL_1 = require("../models/MySQL");
const sendEmail_1 = require("../helpers/sendEmail");
const getModelo_1 = require("../helpers/getModelo");
const crearIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { inc_nombre, inc_descripcion, inc_tipoIncidenteId, inc_estadoIncidenteId, inc_usuarioId, inc_usuarioRevisionId } = _a, body = __rest(_a, ["inc_nombre", "inc_descripcion", "inc_tipoIncidenteId", "inc_estadoIncidenteId", "inc_usuarioId", "inc_usuarioRevisionId"]);
    // incidente
    try {
        //MYSQL
        const incidenteDB = yield incidente_1.default.findOne({
            where: {
                inc_nombre: inc_nombre,
            },
        });
        //MONGODB
        const incidenteMDB = yield IncidenteM.findOne({
            inc_nombre: inc_nombre,
        });
        if (incidenteDB || incidenteMDB) {
            return res.status(400).json({
                msg: `El incidente ${incidenteMDB.inc_nombre},ya existe`,
            });
        }
        //Generar la data a guardar
        const data = Object.assign({ inc_nombre,
            inc_descripcion,
            inc_tipoIncidenteId,
            inc_estadoIncidenteId,
            inc_usuarioId,
            inc_usuarioRevisionId }, body);
        //MYSQL
        const incidente = yield incidente_1.default.create(data);
        //Preparar data mongo
        const usuarioMDB = yield UsuarioM.findOne({
            idMYSQL: data.inc_usuarioId,
        });
        const usuarioRevisionMDB = yield UsuarioM.findOne({
            idMYSQL: data.inc_usuarioRevisionId,
        });
        const tipoIncidenteMDB = yield TipoIncidenteM.findOne({
            idMYSQL: data.inc_tipoIncidenteId,
        });
        const estadoIncidenteMDB = yield EstadoIncidenteM.findOne({
            idMYSQL: data.inc_estadoIncidenteId,
        });
        const { id: idUsuarioMongo } = usuarioMDB;
        const { id: idUsuarioRevisionMongo } = usuarioRevisionMDB;
        const { id: idTipoIncidenteMongo } = tipoIncidenteMDB;
        const { id: idEstadoIncidenteMongo } = estadoIncidenteMDB;
        const dataMongo = Object.assign({ inc_nombre,
            inc_descripcion, inc_tipoIncidente: idTipoIncidenteMongo, inc_usuario: idUsuarioMongo, inc_usuarioRevision: idUsuarioRevisionMongo, inc_estadoIncidente: idEstadoIncidenteMongo, idMYSQL: incidente.id }, body);
        //MONGODB
        const incidenteM = new IncidenteM(dataMongo);
        //Guardar en DB
        yield incidenteM.save();
        // Enviar Email notificar ADMIN que se creo un incidente
        const correoEnviado = yield (0, sendEmail_1.enviarMensajeInsideServer)(usuarioRevisionMDB, `Registro de Incidente`, incidente);
        res.status(201).json({
            msg: "Incidente Creado Correctamente",
            incidente,
            incidenteM,
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
exports.crearIncidente = crearIncidente;
const getIncidentes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {
        inc_estado: true,
    };
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
            IncidenteM.countDocuments(query),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            IncidenteM.find(query)
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
        res.status(200).json({
            msg: "get API -getIncidencias",
            totalMYSQL,
            incidentesMy,
            totalMongoDB,
            incidentesMo,
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
exports.getIncidentes = getIncidentes;
const getIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id: id,
    };
    try {
        //Conseguir el incidente
        //Obtener la dependencia MYSQL
        let incidente = yield incidente_1.default.findOne({
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
        });
        //Obtener la dependencia MONGODB
        let incidenteM = yield IncidenteM.findOne({ idMYSQL: id })
            .populate("inc_usuario", [
            "idMYSQL",
            "nombre",
            "telefono",
            "correo",
            "dependencia",
            "role",
        ])
            .populate("inc_usuarioRevision", ["idMYSQL", "nombre", "correo", "role"])
            .populate("inc_tipoIncidente", [
            "idMYSQL",
            "tinc_nombre",
            "tinc_descripcion",
        ])
            .populate("inc_estadoIncidente", [
            "idMYSQL",
            "est_nombre",
            "est_descripcion",
        ]);
        if (!incidente) {
            incidente = {
                msg: "No se encontro en base MYSQL",
            };
        }
        else if (!incidenteM) {
            incidenteM = {
                msg: "No se encontro en base MONGODB",
            };
        }
        res.status(200).json({
            msg: "get API -getIncidente",
            incidente,
            incidenteM,
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
exports.getIncidente = getIncidente;
//Actualizar Incidente
const actualizarIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _b = req.body, { inc_usuarioRevisionId, inc_usuarioAdmin } = _b, resto = __rest(_b, ["inc_usuarioRevisionId", "inc_usuarioAdmin"]);
    console.log("Llego id", id);
    console.log(inc_usuarioRevisionId);
    console.log(inc_usuarioAdmin);
    try {
        const query = {
            id,
        };
        //Verificar que exista ya uno
        //MYSQL
        //Obtener la dependencia MYSQL
        // const incidenteDB = await Incidente.findByPk(id);
        let incidenteDB = yield incidente_1.default.findOne({
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
        });
        //Obtener la dependencia MONGODB
        // const incidenteMDB = await IncidenteM.findOne({ idMYSQL: id });
        let incidenteMDB = yield IncidenteM.findOne({ idMYSQL: id })
            .populate("inc_usuario", [
            "idMYSQL",
            "nombre",
            "telefono",
            "correo",
            "dependencia",
            "role",
        ])
            .populate("inc_usuarioRevision", ["idMYSQL", "nombre", "correo", "role"])
            .populate("inc_tipoIncidente", [
            "idMYSQL",
            "tinc_nombre",
            "tinc_descripcion",
        ])
            .populate("inc_estadoIncidente", [
            "idMYSQL",
            "est_nombre",
            "est_descripcion",
        ]);
        if (!incidenteDB) {
            return res.status(404).json({
                msg: `No se encontro incidente con el id ${id} en base de datos MYSQL`,
            });
        }
        else if (!incidenteMDB) {
            return res.status(404).json({
                msg: `No se encontro incidente con el id ${id} en base de datos MONGODB`,
            });
        }
        const { id: idMongo } = incidenteMDB;
        const dataMDB = Object.assign({ updatedAt: Date.now(), inc_usuarioRevisionId }, resto);
        //actualizar la dependencia en MYSQL
        const incidenteActualizado = yield incidenteDB.update(dataMDB);
        //actualizar la dependencia en MONGODB
        let { inc_usuarioId: userId, inc_usuarioRevisionId: adminId, inc_tipoIncidenteId: tipoId, inc_estadoIncidenteId: estadoId } = incidenteActualizado, data = __rest(incidenteActualizado, ["inc_usuarioId", "inc_usuarioRevisionId", "inc_tipoIncidenteId", "inc_estadoIncidenteId"]);
        let usuarioRev = yield (0, getModelo_1.getModeloBD)("usuario", { idMYSQL: inc_usuarioRevisionId }, "MONGO");
        let inc_usuario = yield (0, getModelo_1.getModeloBD)("usuario", { id: userId }, "MYSQL");
        let tipoIncide = yield (0, getModelo_1.getModeloBD)("tipoIncidente", { idMYSQL: tipoId }, "MONGO");
        let estadoIncide = yield (0, getModelo_1.getModeloBD)("estadoIncidente", { idMYSQL: estadoId }, "MONGO");
        let { inc_descripcion, inc_nombre, inc_estado } = incidenteActualizado;
        const dataEnvMDB = {
            inc_nombre,
            inc_descripcion,
            inc_estado,
            inc_usuarioRevision: usuarioRev.id,
            inc_tipoIncidente: tipoIncide.id,
            inc_estadoIncidente: estadoIncide.id,
            updatedAt: Date.now(),
        };
        const incidenteMActualizado = yield IncidenteM.findOneAndUpdate({ _id: idMongo }, dataEnvMDB, { new: true });
        // Enviar Email notificar USUARIO que se actualizo su incidnete
        //VERIFICAR si el que actualiza es admin
        if (inc_usuarioAdmin) {
            const queryRevision = {
                id: inc_usuarioAdmin,
            };
            let usuarioAdminMy = yield usuario_1.default.findOne({
                where: queryRevision,
                include: [
                    {
                        model: MySQL_1.Role,
                        as: "role",
                        required: true,
                        attributes: ["id", "rol_nombre", "rol_descripcion"],
                    },
                ],
            });
            let usuarioAdminMo = yield UsuarioM.findOne({
                idMYSQL: query.id,
            }).populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "]);
            if (usuarioAdminMy.role.rol_nombre === "ADMIN_ROLE" ||
                usuarioAdminMo.role.rol_nombre === "ADMIN_ROLE") {
                const { inc_usuario } = incidenteActualizado;
                //Asignacion tenico
                const correoEnviadoTecnico = yield (0, sendEmail_1.enviarMensajeInsideServer)(usuarioRev, `Asignacion de Incidente`, incidenteActualizado);
            }
            //Aviso a usuario
            const correoEnviadoUsuario = yield (0, sendEmail_1.enviarMensajeInsideServer)(inc_usuario, `Actualizacion de Incidente`, incidenteActualizado);
        }
        res.status(200).json({
            msg: "Incidente Actualizado",
            incidenteActualizado,
            incidenteMActualizado,
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
exports.actualizarIncidente = actualizarIncidente;
const borrarIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Deshabilitar
    try {
        //MYSQL
        const incidenteMy = yield incidente_1.default.findByPk(id);
        if (!incidenteMy) {
            return res.status(404).json({
                msg: `No existe un incidente con el id ${id}`,
            });
        }
        //Obtener la dependencia MONGODB
        const incidenteMDB = yield IncidenteM.findOne({ idMYSQL: id });
        const { id: idMongo } = incidenteMDB;
        //MYSQL
        yield incidenteMy.update({ inc_estado: false });
        //MongoDB
        const incidenteMo = yield IncidenteM.findByIdAndUpdate(idMongo, { inc_estado: false, updatedAt: Date.now() }, { new: true });
        res.status(200).json({
            msg: "Incidente  deshabilitado",
            incidenteMy,
            incidenteMo,
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
exports.borrarIncidente = borrarIncidente;
const borrarIncidentePermanente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    //Fisicamente lo borramos
    try {
        //MYSQL
        const incidenteMy = yield incidente_1.default.findByPk(id);
        if (!incidenteMy) {
            return res.status(404).json({
                msg: "No existe una dependencia con el id" + id,
            });
        }
        //Obtener la dependencia MONGODB
        const incidenteMDB = yield IncidenteM.findOne({ idMYSQL: id });
        const { id: idMongo } = incidenteMDB;
        //Eliminar en MYSQL
        yield incidenteMy.destroy();
        //Eliminar MONGODB
        const incidenteMo = yield IncidenteM.findByIdAndDelete(idMongo);
        res.status(200).json({
            msg: "Incidente borrado",
            incidenteMy,
            incidenteMo,
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
exports.borrarIncidentePermanente = borrarIncidentePermanente;
