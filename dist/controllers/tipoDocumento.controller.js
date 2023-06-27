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
exports.borrarTipoDocumentoPermanente = exports.borrarTipoDocumento = exports.actualizarTipoDocumento = exports.getTipoDocumento = exports.getTipoDocumentos = exports.crearTipoDocumento = void 0;
const { TipoDocumentoM } = require("../models/MongoDB/index");
const tipoDocumento_1 = __importDefault(require("../models/MySQL/tipoDocumento"));
const crearTipoDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { tdoc_nombre, tdoc_descripcion, tdoc_estado } = _a, body = __rest(_a, ["tdoc_nombre", "tdoc_descripcion", "tdoc_estado"]);
    try {
        //Verificar que no exista ya uno con el mismo nombre
        //MYSQL
        const tipoDocumentoDB = yield tipoDocumento_1.default.findOne({
            where: {
                tdoc_nombre: tdoc_nombre,
            },
        });
        //MONGODB
        const tipoDocumentoMDB = yield TipoDocumentoM.findOne({
            tdoc_nombre: tdoc_nombre,
        });
        if (tipoDocumentoDB || tipoDocumentoMDB) {
            return res.status(400).json({
                msg: `El tipo de documento ${tipoDocumentoMDB.tdoc_nombre},ya existe`,
            });
        }
        //Generar la data a guardar
        const data = Object.assign({ tdoc_nombre,
            tdoc_descripcion }, body);
        //MYSQL
        const tipoDocumento = yield tipoDocumento_1.default.create(data);
        //MONGODB
        const tipoDocumentoM = new TipoDocumentoM(Object.assign({ idMYSQL: tipoDocumento.id }, data));
        yield tipoDocumentoM.save();
        res.status(201).json({
            msg: "Tipo de Documento creado correctamente.",
            tipoDocumento,
            tipoDocumentoM,
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
exports.crearTipoDocumento = crearTipoDocumento;
const getTipoDocumentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { limite = 5, desde = 0 } = req.query;
    const query = {
        tdoc_estado: true,
    };
    try {
        //Buscar todos los Tipos de Documentos
        //MYSQL
        const [totalMYSQL, tipoDocumentosMy] = yield Promise.all([
            tipoDocumento_1.default.count({ where: query }),
            tipoDocumento_1.default.findAll({ where: query }),
        ]);
        //MONGODB
        const [totalMongoDB, tipoDocumentosMo] = yield Promise.all([
            TipoDocumentoM.countDocuments(query),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            TipoDocumentoM.find(query),
        ]);
        if (!tipoDocumentosMo || !tipoDocumentosMy) {
            return res.status(400).json({
                msg: `No hay tipos de Documento registrados en la base de datos`,
            });
        }
        res.json({
            msg: "get API -getTipoDocumentos",
            totalMYSQL,
            tipoDocumentosMy,
            totalMongoDB,
            tipoDocumentosMo,
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
exports.getTipoDocumentos = getTipoDocumentos;
const getTipoDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id: id,
    };
    try {
        //Obtener el tipo de documento MYSQL
        let tipoDocumento = yield tipoDocumento_1.default.findOne({ where: query });
        //Obtener la dependencia MONGODB
        let tipoDocumentoM = yield TipoDocumentoM.findOne({ idMYSQL: id });
        if (!tipoDocumento) {
            tipoDocumento = {
                msg: "No se encontro en base MYSQL",
            };
        }
        else if (!tipoDocumentoM) {
            tipoDocumentoM = {
                msg: "No se encontro en base MONGODB",
            };
        }
        res.status(200).json({
            msg: "get API -getTipoDocumento ",
            tipoDocumento,
            tipoDocumentoM,
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
exports.getTipoDocumento = getTipoDocumento;
const actualizarTipoDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    //Asignando el usuario que lo esta actualizando
    // data.usuario = req.usuario._id;
    try {
        //Verificar que exista ya uno con el mismo nombre
        //MYSQL
        //Obtener la dependencia MYSQL
        const tipoDocumentoDB = yield tipoDocumento_1.default.findByPk(id);
        //Obtener la dependencia MONGODB
        const tipoDocumentoMDB = yield TipoDocumentoM.findOne({ idMYSQL: id });
        const { id: idMongo } = tipoDocumentoMDB;
        const dataMDB = Object.assign({ updatedAt: Date.now() }, body);
        if (!tipoDocumentoDB) {
            return res.status(404).json({
                msg: `No se encontro Tipo de Documento con el id ${id} en base de datos MYSQL`,
            });
        }
        else if (!tipoDocumentoMDB) {
            return res.status(404).json({
                msg: `No se encontro Tipo de Documento con el id ${id} en base de datos MONGODB`,
            });
        }
        //actualizar la dependencia en MYSQL
        const tipoDocumentoActualizada = yield tipoDocumentoDB.update(body);
        //actualizar la dependencia en MONGODB
        const tipoDocumentoMActualizada = yield TipoDocumentoM.findOneAndUpdate({ _id: idMongo }, dataMDB, {
            new: true,
        });
        res.status(200).json({
            msg: "Tipo de Documento Actualizado Correctamente.",
            tipoDocumentoActualizada,
            tipoDocumentoMActualizada,
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
exports.actualizarTipoDocumento = actualizarTipoDocumento;
const borrarTipoDocumento = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Deshabilitar
    try {
        //MYSQL
        const tipoDocumentoMYSQL = yield tipoDocumento_1.default.findByPk(id);
        if (!tipoDocumentoMYSQL) {
            return res.status(404).json({
                msg: `No existe un Tipo de documento con el id ${id}`,
            });
        }
        //Obtener la dependencia MONGODB
        const tipoDocumentoMDB = yield TipoDocumentoM.findOne({ idMYSQL: id });
        const { id: idMongo } = tipoDocumentoMDB;
        //MYSQL
        yield tipoDocumentoMYSQL.update({ tdoc_estado: false });
        //MongoDB
        const tipoDocumentoM = yield TipoDocumentoM.findByIdAndUpdate(idMongo, { tdoc_estado: false, updatedAt: Date.now() }, { new: true });
        res.status(200).json({
            msg: "Tipo de documento deshabilitado",
            tipoDocumentoMYSQL,
            tipoDocumentoM,
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
exports.borrarTipoDocumento = borrarTipoDocumento;
const borrarTipoDocumentoPermanente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Fisicamente lo borramos
    try {
        //MYSQL
        const tipoDocumentoMYSQL = yield tipoDocumento_1.default.findByPk(id);
        if (!tipoDocumentoMYSQL) {
            return res.status(404).json({
                msg: `No existe un Tipo de documento con el id  ${id}`,
            });
        }
        //Obtener la dependencia MONGODB
        const tipoDocumentoMDB = yield TipoDocumentoM.findOne({ idMYSQL: id });
        const { id: idMongo } = tipoDocumentoMDB;
        //Eliminar en MYSQL
        yield tipoDocumentoMYSQL.destroy();
        //Eliminar MONGODB
        const tipoDocumentoMongo = yield TipoDocumentoM.findByIdAndDelete(idMongo);
        res.status(200).json({
            msg: "Tipo de Documento borrado",
            tipoDocumentoMYSQL,
            tipoDocumentoMongo,
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
exports.borrarTipoDocumentoPermanente = borrarTipoDocumentoPermanente;
