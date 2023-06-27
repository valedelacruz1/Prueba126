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
exports.borrarTipoIncidentePermanente = exports.borrarTipoIncidente = exports.actualizarTipoIncidente = exports.getTipoIncidente = exports.getTipoIncidentes = exports.crearTipoIncidente = void 0;
const { TipoIncidenteM } = require("../models/MongoDB/index");
const tipoIncidente_1 = __importDefault(require("../models/MySQL/tipoIncidente"));
const crearTipoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { tinc_nombre, tinc_descripcion, tinc_estado } = _a, body = __rest(_a, ["tinc_nombre", "tinc_descripcion", "tinc_estado"]);
    try {
        //Verificar que no exista ya uno con el mismo nombre
        //MYSQL
        const tipoIncidenteDB = yield tipoIncidente_1.default.findOne({
            where: {
                tinc_nombre: tinc_nombre,
            },
        });
        //MONGODB
        const tipoIncidenteMDB = yield TipoIncidenteM.findOne({
            tinc_nombre: tinc_nombre,
        });
        if (tipoIncidenteDB || tipoIncidenteMDB) {
            return res.status(400).json({
                msg: `El tipo de incidente ${tipoIncidenteMDB.tinc_nombre},ya existe`,
            });
        }
        //Generar la data a guardar
        const data = Object.assign({ tinc_nombre,
            tinc_descripcion }, body);
        //MYSQL
        const tipoIncidente = yield tipoIncidente_1.default.create(data);
        //MONGODB
        const tipoIncidenteM = new TipoIncidenteM(Object.assign({ idMYSQL: tipoIncidente.id }, data));
        yield tipoIncidenteM.save();
        res.status(201).json({
            msg: "Tipo de Incidente creado correctamente.",
            tipoIncidente,
            tipoIncidenteM,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador.",
            //BDSTATUS
        });
    }
});
exports.crearTipoIncidente = crearTipoIncidente;
const getTipoIncidentes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { limite = 5, desde = 0 } = req.query;
    const query = {
        tinc_estado: true,
    };
    try {
        //Buscar todos los Tipos de Incidentes
        //MYSQL
        const [totalMYSQL, tipoIncidentesMy] = yield Promise.all([
            tipoIncidente_1.default.count({ where: query }),
            tipoIncidente_1.default.findAll({ where: query }),
        ]);
        //MONGODB
        const [totalMongoDB, tipoIncidentesMo] = yield Promise.all([
            TipoIncidenteM.countDocuments(query),
            // tipoIncidenteM.find(query).skip(Number(desde)).limit(Number(limite)),
            TipoIncidenteM.find(query),
        ]);
        if (!tipoIncidentesMo || !tipoIncidentesMy) {
            return res.status(400).json({
                msg: `No hay tipos de Incidente registrados en la base de datos`,
            });
        }
        res.json({
            msg: "get API -gettipoIncidentes",
            totalMYSQL,
            tipoIncidentesMy,
            totalMongoDB,
            tipoIncidentesMo,
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
exports.getTipoIncidentes = getTipoIncidentes;
const getTipoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id: id,
    };
    try {
        //Obtener el tipo de Incidente MYSQL
        let tipoIncidente = yield tipoIncidente_1.default.findOne({ where: query });
        //Obtener la dependencia MONGODB
        let tipoIncidenteM = yield TipoIncidenteM.findOne({ idMYSQL: id });
        if (!tipoIncidente) {
            tipoIncidente = {
                msg: "No se encontro en base MYSQL",
            };
        }
        else if (!tipoIncidenteM) {
            tipoIncidenteM = {
                msg: "No se encontro en base MONGODB",
            };
        }
        res.status(200).json({
            msg: "get API -getTipoIncidente ",
            tipoIncidente,
            tipoIncidenteM,
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
exports.getTipoIncidente = getTipoIncidente;
const actualizarTipoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    //Asignando el usuario que lo esta actualizando
    // data.usuario = req.usuario._id;
    try {
        //Verificar que exista ya uno con el mismo nombre
        //MYSQL
        //Obtener la dependencia MYSQL
        const tipoIncidenteDB = yield tipoIncidente_1.default.findByPk(id);
        //Obtener la dependencia MONGODB
        const tipoIncidenteMDB = yield TipoIncidenteM.findOne({ idMYSQL: id });
        const { id: idMongo } = tipoIncidenteMDB;
        const dataMDB = Object.assign({ updatedAt: Date.now() }, body);
        if (!tipoIncidenteDB) {
            return res.status(404).json({
                msg: `No se encontro Tipo de Incidente con el id ${id} en base de datos MYSQL`,
            });
        }
        else if (!tipoIncidenteMDB) {
            return res.status(404).json({
                msg: `No se encontro Tipo de Incidente con el id ${id} en base de datos MONGODB`,
            });
        }
        //actualizar la dependencia en MYSQL
        const tipoIncidenteActualizada = yield tipoIncidenteDB.update(body);
        //actualizar la dependencia en MONGODB
        const tipoIncidenteMActualizada = yield TipoIncidenteM.findOneAndUpdate(idMongo, dataMDB, {
            new: true,
        });
        res.status(200).json({
            msg: 'Tipo de Incidente Actualizado Correctamente.',
            tipoIncidenteActualizada,
            tipoIncidenteMActualizada,
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
exports.actualizarTipoIncidente = actualizarTipoIncidente;
const borrarTipoIncidente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Deshabilitar
    try {
        //MYSQL
        const tipoIncidenteMYSQL = yield tipoIncidente_1.default.findByPk(id);
        if (!tipoIncidenteMYSQL) {
            return res.status(404).json({
                msg: `No existe un Tipo de Incidente con el id ${id}`,
            });
        }
        //Obtener la dependencia MONGODB
        const tipoIncidenteMDB = yield TipoIncidenteM.findOne({ idMYSQL: id });
        const { id: idMongo } = tipoIncidenteMDB;
        //MYSQL
        yield tipoIncidenteMYSQL.update({ tinc_estado: false });
        //MongoDB
        const tipoIncidenteM = yield TipoIncidenteM.findByIdAndUpdate(idMongo, { tinc_estado: false, updatedAt: Date.now() }, { new: true });
        res.status(200).json({
            msg: 'Tipo de Incidente deshabilitado',
            tipoIncidenteMYSQL,
            tipoIncidenteM
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
exports.borrarTipoIncidente = borrarTipoIncidente;
const borrarTipoIncidentePermanente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Fisicamente lo borramos
    try {
        //MYSQL
        const tipoIncidenteMYSQL = yield tipoIncidente_1.default.findByPk(id);
        if (!tipoIncidenteMYSQL) {
            return res.status(404).json({
                msg: `No existe un Tipo de Incidente con el id  ${id}`,
            });
        }
        //Obtener la dependencia MONGODB
        const tipoIncidenteMDB = yield TipoIncidenteM.findOne({ idMYSQL: id });
        const { id: idMongo } = tipoIncidenteMDB;
        //Eliminar en MYSQL
        yield tipoIncidenteMYSQL.destroy();
        //Eliminar MONGODB
        const tipoIncidenteMongo = yield TipoIncidenteM.findByIdAndDelete(idMongo);
        res.status(200).json({
            msg: 'Tipo de Incidente borrado',
            tipoIncidenteMYSQL,
            tipoIncidenteMongo,
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
exports.borrarTipoIncidentePermanente = borrarTipoIncidentePermanente;
