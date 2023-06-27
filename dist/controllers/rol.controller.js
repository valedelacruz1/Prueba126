"use strict";
//TODO: TERMINAR CONTROLADOR
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
exports.borrarRolPermanente = exports.borrarRole = exports.actualizarRole = exports.getRole = exports.getRoles = exports.crearRole = void 0;
const { RoleM } = require("../models/MongoDB/index");
const role_1 = __importDefault(require("../models/MySQL/role"));
const crearRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { rol_nombre, rol_descripcion } = _a, body = __rest(_a, ["rol_nombre", "rol_descripcion"]);
    try {
        //Verificar que no exista ya uno con el mismo nombre
        //MYSQL
        const roleDB = yield role_1.default.findOne({
            where: {
                rol_nombre: rol_nombre,
            },
        });
        //MONGODB
        const roleMDB = yield RoleM.findOne({
            rol_nombre: rol_nombre,
        });
        if (roleDB || roleMDB) {
            return res.status(400).json({
                msg: `El Rol ${roleMDB.rol_nombre},ya existe`,
            });
        }
        //Generar la data a guardar
        const data = Object.assign({ rol_nombre,
            rol_descripcion }, body);
        //MYSQL
        const role = yield role_1.default.create(data);
        //MONGODB
        const roleM = new RoleM(Object.assign({ idMYSQL: role.id }, data));
        yield roleM.save();
        res.status(201).json({
            msg: "Rol Creado correctamente.",
            role,
            roleM,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //
        });
    }
});
exports.crearRole = crearRole;
const getRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const { limite = 5, desde = 0 } = req.query;
    const query = {
        rol_estado: true,
    };
    try {
        //Buscar todas las dependencias
        //MYSQL
        const [totalMYSQL, rolesMy] = yield Promise.all([
            role_1.default.count({ where: query }),
            role_1.default.findAll({ where: query }),
        ]);
        //MONGODB
        const [totalMongoDB, rolesMo] = yield Promise.all([
            RoleM.countDocuments(query),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            RoleM.find(query),
        ]);
        if (!rolesMo || !rolesMy) {
            return res.status(400).json({
                msg: `No hay Roles registrados en la base de datos`,
            });
        }
        res.status(200).json({
            msg: "get API -getRoles",
            totalMYSQL,
            rolesMy,
            totalMongoDB,
            rolesMo,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //
        });
    }
});
exports.getRoles = getRoles;
const getRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id: id,
    };
    try {
        //Obtener el rol MYSQL
        let role = yield role_1.default.findOne({ where: query });
        //Obtener el rol MONGODB
        let roleM = yield RoleM.findOne({ idMYSQL: id });
        if (!role) {
            role = {
                msg: "No se encontro en base MYSQL",
            };
        }
        else if (!roleM) {
            roleM = {
                msg: "No se encontro en base MONGODB",
            };
        }
        res.status(200).json({
            msg: "get API - getRole",
            role,
            roleM,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //
        });
    }
});
exports.getRole = getRole;
const actualizarRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { body } = req;
    //Asignando el usuario que lo esta actualizando
    // data.usuario = req.usuario._id;
    try {
        //Verificar que exista ya uno con el mismo nombre
        //MYSQL
        //Obtener la dependencia MYSQL
        const roleDB = yield role_1.default.findByPk(id);
        //Obtener la dependencia MONGODB
        const roleMDB = yield RoleM.findOne({ idMYSQL: id });
        const { id: idMongo } = roleMDB;
        const dataMDB = Object.assign({ updatedAt: Date.now() }, body);
        if (!roleDB) {
            return res.status(404).json({
                msg: `No se encontro rol con el id ${id} en base de datos MYSQL`,
            });
        }
        else if (!roleMDB) {
            return res.status(404).json({
                msg: `No se encontro rol con el id ${id} en base de datos MONGODB`,
            });
        }
        //actualizar la dependencia en MYSQL
        const roleActualizado = yield roleDB.update(body);
        //actualizar la dependencia en MONGODB
        const roleMActualizado = yield RoleM.findOneAndUpdate({ _id: idMongo }, dataMDB, {
            new: true,
        });
        res.status(200).json({
            msg: "Rol Actualizado Correctamente.",
            roleActualizado,
            roleMActualizado,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //
        });
    }
});
exports.actualizarRole = actualizarRole;
const borrarRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Deshabilitar
    try {
        //MYSQL
        const roleMYSQL = yield role_1.default.findByPk(id);
        if (!roleMYSQL) {
            return res.status(404).json({
                msg: "No existe un rol con el id" + id,
            });
        }
        //Obtener la dependencia MONGODB
        const roleMDB = yield RoleM.findOne({ idMYSQL: id });
        const { id: idMongo } = roleMDB;
        //MYSQL
        yield roleMYSQL.update({ rol_estado: false });
        //MongoDB
        const roleM = yield RoleM.findByIdAndUpdate(idMongo, { rol_estado: false, updatedAt: Date.now() }, { new: true });
        res.status(200).json({
            msg: "Rol deshabilitado",
            roleMYSQL,
            roleM,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //
        });
    }
});
exports.borrarRole = borrarRole;
const borrarRolPermanente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Fisicamente lo borramos
    try {
        //MYSQL
        const roleMYSQL = yield role_1.default.findByPk(id);
        if (!roleMYSQL) {
            return res.status(404).json({
                msg: "No existe un rol con el id" + id,
            });
        }
        //Obtener la dependencia MONGODB
        const roleMDB = yield RoleM.findOne({ idMYSQL: id });
        const { id: idMongo } = roleMDB;
        //Eliminar en MYSQL
        yield roleMYSQL.destroy();
        //Eliminar MONGODB
        const roleMongo = yield RoleM.findByIdAndDelete(idMongo);
        res.status(200).json({
            msg: "Rol borrado",
            roleMYSQL,
            roleMongo,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            //
        });
    }
});
exports.borrarRolPermanente = borrarRolPermanente;
