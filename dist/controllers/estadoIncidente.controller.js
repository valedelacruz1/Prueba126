"use strict";
//TODO: PULIR CONTROLADOR
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
exports.borrarEstadoIncidentePermanente = exports.borrarEstadoIncidente = exports.actualizarEstadoIncidente = exports.getEstadoIncidente = exports.getEstadoIncidentes = exports.crearEstadoIncidente = void 0;
const { EstadoIncidenteM } = require("../models/MongoDB/index");
const estadoIncidente_1 = __importDefault(require("../models/MySQL/estadoIncidente"));
const getModelo_1 = require("../helpers/getModelo");
const crearEstadoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { est_nombre, est_descripcion } = _a, body = __rest(_a, ["est_nombre", "est_descripcion"]);
    try {
        //Verificar que no exista ya uno con el mismo nombre
        //MYSQL
        const estadoIncidenteDB = yield estadoIncidente_1.default.findOne({
            where: { est_nombre: est_nombre },
        });
        //MONGODB
        const estadoIncidenteMDB = yield EstadoIncidenteM.findOne({
            est_nombre: est_nombre,
        });
        if (estadoIncidenteDB || estadoIncidenteMDB) {
            return res.status(400).json({
                msg: `El Estado Incidente ${estadoIncidenteMDB.est_nombre},ya existe`,
            });
        }
        //Generar la data a guardar
        const data = Object.assign({ est_nombre,
            est_descripcion }, body);
        //MYSQL
        const estadoIncidente = yield estadoIncidente_1.default.create(data);
        //MONGODB
        const estadoIncidenteM = new EstadoIncidenteM(Object.assign({ idMYSQL: estadoIncidente.id }, data));
        yield estadoIncidenteM.save();
        res.status(201).json({
            msg: "Estado de Incidente creado correctamente.",
            estadoIncidente,
            estadoIncidenteM,
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
exports.crearEstadoIncidente = crearEstadoIncidente;
const getEstadoIncidentes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { limite = 5, desde = 0 } = req.query;
    const query = {
        est_estado: true,
    };
    try {
        //Buscar todas las dependencias
        //MYSQL
        const [totalMYSQL, estadoIncidentesMy] = yield Promise.all([
            estadoIncidente_1.default.count({ where: query }),
            estadoIncidente_1.default.findAll({ where: query }),
        ]);
        //MONGODB
        const [totalMongoDB, estadoIncidentesMo] = yield Promise.all([
            EstadoIncidenteM.countDocuments(query),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            EstadoIncidenteM.find(query),
        ]);
        if (!estadoIncidentesMo || !estadoIncidentesMy) {
            return res.status(400).json({
                msg: `No hay Estados Incidente registrados en la base de datos`,
            });
        }
        res.status(200).json({
            msg: 'get Api-getEstadoIncidentes',
            totalMYSQL,
            estadoIncidentesMy,
            totalMongoDB,
            estadoIncidentesMo,
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
exports.getEstadoIncidentes = getEstadoIncidentes;
const getEstadoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id: id,
    };
    const queryMongo = {
        idMYSQL: id
    };
    try {
        //Obtener la dependencia MYSQL
        let estadoIncidente = yield (0, getModelo_1.getModeloBD)('estadoIncidente', query, "MYSQL");
        //Obtener la dependencia MONGODB
        let estadoIncidenteM = yield (0, getModelo_1.getModeloBD)('estadoIncidente', queryMongo, "MONGO");
        if (!estadoIncidente) {
            estadoIncidente = {
                msg: "No se encontro en base MYSQL",
            };
        }
        else if (!estadoIncidenteM) {
            estadoIncidenteM = {
                msg: "No se encontro en base MONGODB",
            };
        }
        res.status(200).json({
            msg: 'get API- getEstadoIncidente',
            estadoIncidente,
            estadoIncidenteM,
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
exports.getEstadoIncidente = getEstadoIncidente;
const actualizarEstadoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    //Asignando el usuario que lo esta actualizando
    // data.usuario = req.usuario._id;
    try {
        //Verificar que exista ya uno con el mismo nombre
        //MYSQL
        //Obtener la dependencia MYSQL
        const estadoIncidenteDB = yield estadoIncidente_1.default.findByPk(id);
        //Obtener la dependencia MONGODB
        const estadoIncidenteMDB = yield EstadoIncidenteM.findOne({ idMYSQL: id });
        if (!estadoIncidenteDB) {
            return res.status(404).json({
                msg: `No se encontro Estado Incidente con el id ${id} en base de datos MYSQL`,
            });
        }
        else if (!estadoIncidenteMDB) {
            return res.status(404).json({
                msg: `No se encontro Estado Incidente con el id ${id} en base de datos MONGODB`,
            });
        }
        //actualizar la dependencia en MYSQL
        yield estadoIncidenteDB.update(body);
        //actualizar la dependencia en MONGODB
        yield estadoIncidenteMDB.findByIdAndUpdate(estadoIncidenteMDB._id, body, {
            new: true,
        });
        res.status(200).json({
            msg: "Estado de Incidente Actualizado correctamente.",
            estadoIncidenteDB,
            estadoIncidenteMDB,
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
exports.actualizarEstadoIncidente = actualizarEstadoIncidente;
const borrarEstadoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Deshabilitar
    try {
        //MYSQL
        const estadoIncidenteMYSQL = yield estadoIncidente_1.default.findByPk(id);
        if (!estadoIncidenteMYSQL) {
            return res.status(404).json({
                msg: "No existe un Estado Incidente con el id" + id,
            });
        }
        //Obtener la dependencia MONGODB
        const estadoIncidenteMDB = yield EstadoIncidenteM.findOne({ idMYSQL: id });
        const { id: idMongo } = estadoIncidenteMDB;
        //MYSQL
        yield estadoIncidenteMYSQL.update({ est_estado: false });
        //MongoDB
        const estadoIncidenteM = yield EstadoIncidenteM.findByIdAndUpdate(idMongo, { est_estado: false }, { new: true });
        res.status(200).json({
            msg: "Estado de Incidente deshabilitado",
            estadoIncidenteMYSQL,
            estadoIncidenteM,
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
exports.borrarEstadoIncidente = borrarEstadoIncidente;
const borrarEstadoIncidentePermanente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Fisicamente lo borramos
    try {
        //MYSQL
        const estadoIncidenteMYSQL = yield estadoIncidente_1.default.findByPk(id);
        if (!estadoIncidenteMYSQL) {
            return res.status(404).json({
                msg: "No existe un Estado Incidente con el id" + id,
            });
        }
        //Obtener la dependencia MONGODB
        const EstadoIncidenteMDB = yield EstadoIncidenteM.findOne({ idMYSQL: id });
        const { id: idMongo } = EstadoIncidenteMDB;
        //Eliminar en MYSQL
        yield estadoIncidenteMYSQL.destroy();
        //Eliminar en MONGODB
        const estadoIncidenteMongo = yield EstadoIncidenteM.findByIdAndDelete(idMongo);
        res.status(200).json({
            msg: "Tipo de Documento borrado",
            estadoIncidenteMYSQL,
            estadoIncidenteMongo,
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
exports.borrarEstadoIncidentePermanente = borrarEstadoIncidentePermanente;
