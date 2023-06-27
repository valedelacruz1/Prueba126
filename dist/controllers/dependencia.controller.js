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
exports.sincronizarTablaDependencia = exports.borrarDependenciaPermanente = exports.borrarDependencia = exports.actualizarDependencia = exports.getDependencia = exports.getDependencias = exports.crearDependencia = void 0;
const { DependenciaM } = require("../models/MongoDB/index");
const dependencia_1 = __importDefault(require("../models/MySQL/dependencia"));
const getModelo_1 = require("../helpers/getModelo");
const syncModelos_1 = require("../helpers/syncModelos");
const crearDependencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { dep_nombre, dep_descripcion } = _a, body = __rest(_a, ["dep_nombre", "dep_descripcion"]);
    try {
        //Verificar que no exista ya uno con el mismo nombre
        //MYSQL
        const dependenciaDB = yield dependencia_1.default.findOne({
            where: {
                dep_nombre: dep_nombre,
            },
        });
        //MONGODB
        const dependenciaMDB = yield DependenciaM.findOne({
            dep_nombre: dep_nombre,
        });
        if (dependenciaDB || dependenciaMDB) {
            return res.status(400).json({
                msg: `La Dependencia ${dependenciaMDB.dep_nombre},ya existe`,
            });
        }
        //Generar la data a guardar
        const data = Object.assign({ dep_nombre,
            dep_descripcion }, body);
        //MYSQL
        const dependencia = yield dependencia_1.default.create(data);
        //MONGODB
        const dependenciaM = new DependenciaM(Object.assign({ idMYSQL: dependencia.id || null }, data));
        yield dependenciaM.save();
        res.status(201).json({
            msg: "Dependencia Creada Correctamente",
            dependencia,
            dependenciaM,
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
exports.crearDependencia = crearDependencia;
const getDependencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { limite = 5, desde = 0 } = req.query;
    const query = {
        dep_estado: true,
    };
    try {
        //Buscar todas las dependencias
        //MYSQL
        const [totalMYSQL, dependenciasMy] = yield Promise.all([
            dependencia_1.default.count({ where: query }),
            dependencia_1.default.findAll({ where: query }),
        ]);
        //MONGODB
        const [totalMongoDB, dependenciasMo] = yield Promise.all([
            DependenciaM.countDocuments(query),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            DependenciaM.find(query),
        ]);
        if (!dependenciasMo || !dependenciasMy) {
            return res.status(400).json({
                msg: `No hay tipos de Documento registrados en la base de datos`,
            });
        }
        res.status(200).json({
            msg: "get API -getDependencias",
            totalMYSQL,
            dependenciasMy,
            totalMongoDB,
            dependenciasMo,
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
exports.getDependencias = getDependencias;
const getDependencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id: id,
    };
    const queryMongo = {
        idMYSQL: id,
    };
    try {
        //Obtener la dependencia MYSQL
        let dependencia = yield (0, getModelo_1.getModeloBD)("dependencia", query, "MYSQL");
        //Obtener la dependencia MONGODB
        let dependenciaM = yield (0, getModelo_1.getModeloBD)("dependencia", queryMongo, "MONGO");
        // DependenciaM.findOne({ idMYSQL: id });
        if (!dependencia) {
            dependencia = {
                msg: "No se encontro en base MYSQL",
            };
        }
        else if (!dependenciaM) {
            dependenciaM = {
                msg: "No se encontro en base MONGODB",
            };
        }
        res.status(200).json({
            msg: "get API -getDependencia ",
            dependencia,
            dependenciaM,
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
exports.getDependencia = getDependencia;
const actualizarDependencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    //Asignando el usuario que lo esta actualizando
    // data.usuario = req.usuario._id;
    try {
        //Verificar que exista ya uno con el mismo nombre
        //MYSQL
        //Obtener la dependencia MYSQL
        const dependenciaDB = yield dependencia_1.default.findByPk(id);
        //Obtener la dependencia MONGODB
        const dependenciaMDB = yield DependenciaM.findOne({ idMYSQL: id });
        const { id: idMongo } = dependenciaMDB;
        const dataMDB = Object.assign({ updatedAt: Date.now() }, body);
        if (!dependenciaDB) {
            return res.status(404).json({
                msg: `No se encontro dependencia con el id ${id} en base de datos MYSQL`,
            });
        }
        else if (!dependenciaMDB) {
            return res.status(404).json({
                msg: `No se encontro dependencia con el id ${id} en base de datos MONGODB`,
            });
        }
        //actualizar la dependencia en MYSQL
        const dependenciaActualizada = yield dependenciaDB.update(body);
        //actualizar la dependencia en MONGODB
        const dependenciaMActualizada = yield DependenciaM.findOneAndUpdate(idMongo, dataMDB, {
            new: true,
        });
        res.status(200).json({
            msg: "Dependencia Actualizada",
            dependenciaActualizada,
            dependenciaMActualizada,
            // dataMDB
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
exports.actualizarDependencia = actualizarDependencia;
const borrarDependencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id,
    };
    const queryMongo = {
        idMYSQL: id,
    };
    //Deshabilitar
    try {
        //MYSQL
        const dependenciaDB = yield dependencia_1.default.findByPk(id);
        if (!dependenciaDB) {
            return res.status(404).json({
                msg: `No existe una dependencia con el id ${id}`,
            });
        }
        //Obtener la dependencia MONGODB
        const dependenciaMDB = yield (0, getModelo_1.getModeloBD)("dependencia", queryMongo, "MONGO");
        const { id: idMongo } = dependenciaMDB;
        //MYSQL
        yield dependenciaDB.update({ dep_estado: false });
        //MongoDB
        const dependenciaM = yield DependenciaM.findByIdAndUpdate(idMongo, { dep_estado: false, updatedAt: Date.now() }, { new: true });
        res.status(200).json({
            msg: "Dependencia deshabilitada",
            dependenciaDB,
            dependenciaM,
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
exports.borrarDependencia = borrarDependencia;
const borrarDependenciaPermanente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Fisicamente lo borramos
    try {
        //MYSQL
        const dependenciaMYSQL = yield dependencia_1.default.findByPk(id);
        if (!dependenciaMYSQL) {
            return res.status(404).json({
                msg: "No existe una dependencia con el id" + id,
            });
        }
        //Obtener la dependencia MONGODB
        const dependenciaMDB = yield DependenciaM.findOne({ idMYSQL: id });
        const { id: idMongo } = dependenciaMDB;
        //Eliminar en MYSQL
        yield dependenciaMYSQL.destroy();
        //Eliminar MONGODB
        const dependenciaMongo = yield DependenciaM.findByIdAndDelete(idMongo);
        res.status(200).json({
            msg: "Tipo de documento borrado",
            dependenciaMYSQL,
            dependenciaMongo,
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
exports.borrarDependenciaPermanente = borrarDependenciaPermanente;
const sincronizarTablaDependencia = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalMYSQL, dependenciasMy] = yield Promise.all([
        dependencia_1.default.count(),
        dependencia_1.default.findAll(),
    ]);
    //MONGODB
    const [totalMongoDB, dependenciasMo] = yield Promise.all([
        DependenciaM.countDocuments(),
        DependenciaM.find(),
    ]);
    //INSERTAR
    //mongo tiene mas que mysql
    if (totalMongoDB > totalMYSQL) {
        //Si esta que tengo en mongo no esta en mysql se la meto a mysql
        let query;
        dependenciasMo.forEach((dependenciaMo) => {
            query = {
                id: dependenciaMo.id,
            };
            let isOnMYSQL = (0, getModelo_1.getModeloBD)("dependencia", query, "MYSQL");
            //SI NO ESTA EN MYSQL LO INSERTA
            if (!isOnMYSQL) {
                //Generar la data a guardar
                const { id, idMYSQL } = dependenciaMo, data = __rest(dependenciaMo, ["id", "idMYSQL"]);
                let dependenciaEnvio = Object.assign({}, data);
                (0, syncModelos_1.insercionSincronizacion)("dependencia", "MYSQL", dependenciaEnvio);
            }
        });
    }
    //mysql tiene mas que mongo
    else if (totalMYSQL > totalMongoDB) {
        let queryMongo;
        dependenciasMo.forEach((dependenciaMy) => {
            queryMongo = {
                idMYSQL: dependenciaMy.id,
            };
            let isOnMONGO = (0, getModelo_1.getModeloBD)("dependencia", queryMongo, "MONGO");
            //SI NO ESTA EN MYSQL LO INSERTA
            if (!isOnMONGO) {
                //Generar la data a guardar
                let dependenciaEnvio = Object.assign({ idMYSQL: dependenciaMy.id }, dependenciaMy);
                (0, syncModelos_1.insercionSincronizacion)("dependencia", "MONGO", dependenciaEnvio);
            }
        });
    }
    //ACTUALIZAR
    if (totalMongoDB == totalMYSQL) {
        dependenciasMo.forEach((dependenciaMo) => {
            dependenciasMy.forEach((dependenciaMy) => {
                if (dependenciaMy.id === dependenciaMo.idMYSQL) {
                    if (dependenciaMy.dep_nombre !== dependenciaMo.dep_nombre ||
                        dependenciaMy.dep_descripcion !== dependenciasMo.dep_descripcion) {
                    }
                }
            });
        });
    }
});
exports.sincronizarTablaDependencia = sincronizarTablaDependencia;
