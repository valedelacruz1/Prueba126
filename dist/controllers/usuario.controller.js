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
exports.borrarUsuarioPermanente = exports.borrarUsuario = exports.actualizarUsuario = exports.getUsuario = exports.getUsuarios = exports.crearUsuario = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const usuario_1 = __importDefault(require("../models/MySQL/usuario"));
const role_1 = __importDefault(require("../models/MySQL/role"));
const dependencia_1 = __importDefault(require("../models/MySQL/dependencia"));
const tipoDocumento_1 = __importDefault(require("../models/MySQL/tipoDocumento"));
const sendEmail_1 = require("../helpers/sendEmail");
const getModelo_1 = require("../helpers/getModelo");
const { UsuarioM, DependenciaM, RoleM, TipoDocumentoM, } = require("../models/MongoDB/index");
const crearUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { username, password, nombre, correo, apellido, telefono, roleId, dependenciaId, tipoDocumentoId } = _a, body = __rest(_a, ["username", "password", "nombre", "correo", "apellido", "telefono", "roleId", "dependenciaId", "tipoDocumentoId"]);
    try {
        // Validamos si el usuario ya existe en la base de datos
        //MYSQL
        const usuarioDB = yield usuario_1.default.findOne({ where: { username: username } });
        const usuarioCorreoDB = yield usuario_1.default.findOne({ where: { correo } });
        let usuarioInfoEmail;
        //MONGODB
        const usuarioMDB = yield UsuarioM.findOne({
            username: username,
        });
        const usuarioCorreoMDB = yield UsuarioM.findOne({
            correo,
        });
        if (usuarioDB || usuarioMDB || usuarioCorreoDB || usuarioCorreoMDB) {
            return res.status(400).json({
                msg: `Ya existe el usuario `,
            });
        }
        // Guardamos usuario en la base de datos
        usuarioInfoEmail = {
            nombre,
            username,
            correo,
            password,
        };
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        //Generar la data a guardar
        const data = Object.assign({ username, password: hashedPassword, nombre,
            apellido,
            correo,
            telefono,
            roleId,
            dependenciaId,
            tipoDocumentoId }, body);
        const usuario = yield usuario_1.default.create(data);
        //MONGODB
        //Preparar data mongo
        const dependenciaMDB = yield DependenciaM.findOne({
            idMYSQL: dependenciaId,
        });
        const roleMDB = yield RoleM.findOne({ idMYSQL: roleId });
        const tipoDocumentoMDB = yield TipoDocumentoM.findOne({
            idMYSQL: tipoDocumentoId,
        });
        const { id: idDependenciaMongo } = dependenciaMDB;
        const { id: idRoleMongo } = roleMDB;
        const { id: idTipoDocumentoMongo } = tipoDocumentoMDB;
        const dataMongo = Object.assign({ username: data.username, correo, password: hashedPassword, nombre,
            telefono,
            apellido, idMYSQL: usuario.id, role: idRoleMongo, dependencia: idDependenciaMongo, tipoDocumento: idTipoDocumentoMongo }, body);
        const usuarioM = new UsuarioM(dataMongo);
        yield usuarioM.save();
        // NOTIFICAR AL USUARIO QUE SE CREO UNA CUENTA CON SU NOMBRE
        const correoEnviado = yield (0, sendEmail_1.enviarMensajeInsideServer)(usuarioInfoEmail, `Registro de Usuario`, usuarioInfoEmail);
        let usuarioEnvio;
        if (!usuario) {
            usuarioEnvio = usuarioM;
        }
        else {
            usuarioEnvio = usuario;
        }
        res.status(201).json({
            msg: `Usuario ${username} creado exitosamente!`,
            usuario: usuarioEnvio,
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
exports.crearUsuario = crearUsuario;
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   const { limite = 5, desde = 0 } = req.query;
    const query = {
        estado: true,
    };
    try {
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
            UsuarioM.countDocuments(query),
            // TipoDocumentoM.find(query).skip(Number(desde)).limit(Number(limite)),
            UsuarioM.find(query)
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
exports.getUsuarios = getUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const query = {
        id: id,
    };
    try {
        //Obtener la dependencia MYSQL
        let usuarioMy = yield usuario_1.default.findOne({
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
        });
        //Obtener la dependencia MONGODB
        let usuarioMo = yield UsuarioM.findOne({ idMYSQL: id })
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
        ]);
        if (!usuarioMy) {
            usuarioMy = {
                msg: "No se encontro en base MYSQL",
            };
        }
        else if (!usuarioMo) {
            usuarioMo = {
                msg: "No se encontro en base MONGODB",
            };
        }
        res.status(200).json({
            msg: "get API -getUsuario ",
            usuarioMy,
            usuarioMo,
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
exports.getUsuario = getUsuario;
const actualizarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const _b = req.body, { password, roleId, tipoDocumentoId, dependenciaId } = _b, resto = __rest(_b, ["password", "roleId", "tipoDocumentoId", "dependenciaId"]);
    try {
        const query = {
            id,
        };
        //Verificar que  exista ya uno con el mismo nombre
        //MYSQL
        //Obtener el usuario MYSQL
        // const usuarioMy = await Usuario.findByPk(id);
        let usuarioMy = yield usuario_1.default.findOne({
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
        });
        //Obtener el usuario MONGODB
        let usuarioMo = yield UsuarioM.findOne({ idMYSQL: id })
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
        ]);
        if (!usuarioMy) {
            return res.status(404).json({
                msg: `No se encontro usuario con el id ${id} en base de datos MYSQL`,
            });
        }
        else if (!usuarioMo) {
            return res.status(404).json({
                msg: `No se encontro dependencia con el id ${id} en base de datos MONGODB`,
            });
        }
        // console.log(usuarioMy,usuarioMo);
        let rolMo;
        let depen;
        let tipoDocumen;
        if (password) {
            const salt = bcrypt_1.default.genSaltSync();
            resto.password = bcrypt_1.default.hashSync(password, salt);
        }
        const dataMDB = Object.assign({ updatedAt: Date.now(), dependenciaId,
            roleId,
            tipoDocumentoId }, resto);
        //actualizar el usuario en MYSQL
        const usuarioMyActualizado = yield usuarioMy.update(dataMDB);
        //actualizar el usuario en MONGODB
        rolMo = yield (0, getModelo_1.getModeloBD)("role", { idMYSQL: roleId }, "MONGO");
        depen = yield (0, getModelo_1.getModeloBD)("dependencia", { idMYSQL: dependenciaId }, "MONGO");
        console.log('dependencia', depen);
        tipoDocumen = yield (0, getModelo_1.getModeloBD)("tipoDocumento", { idMYSQL: tipoDocumentoId }, "MONGO");
        const { id: idMongo } = usuarioMo;
        let dataMongoEnviar = Object.assign({ dependencia: depen.id, role: rolMo.id, tipoDocumento: tipoDocumen.id }, resto);
        const usuarioMoActualizado = yield UsuarioM.findOneAndUpdate({ _id: idMongo }, dataMongoEnviar, {
            new: true,
        });
        res.status(200).json({
            msg: "Usuario Actualizado",
            usuarioMyActualizado,
            usuarioMoActualizado,
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
exports.actualizarUsuario = actualizarUsuario;
const borrarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Deshabilitar
    try {
        //MYSQL
        const usuarioMy = yield usuario_1.default.findByPk(id);
        if (!usuarioMy) {
            return res.status(404).json({
                msg: `No existe un usuario con el id ${id}`,
            });
        }
        //Obtener la dependencia MONGODB
        const usuarioMDB = yield UsuarioM.findOne({ idMYSQL: id });
        const { id: idMongo } = usuarioMDB;
        //MYSQL
        yield usuarioMy.update({ dep_estado: false });
        //MongoDB
        const usuarioMo = yield UsuarioM.findByIdAndUpdate(idMongo, { estado: false, updatedAt: Date.now() }, { new: true });
        res.status(200).json({
            msg: "Usuario deshabilitado",
            usuarioMy,
            usuarioMo,
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
exports.borrarUsuario = borrarUsuario;
const borrarUsuarioPermanente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //Fisicamente lo borramos
    try {
        //MYSQL
        const usuarioMy = yield usuario_1.default.findByPk(id);
        if (!usuarioMy) {
            return res.status(404).json({
                msg: "No existe un usuario con el id" + id,
            });
        }
        //Obtener el usuario en  MONGODB
        const usuarioMDB = yield UsuarioM.findOne({ idMYSQL: id });
        const { id: idMongo } = usuarioMDB;
        //Eliminar en MYSQL
        yield usuarioMy.destroy();
        //Eliminar MONGODB
        const usuarioMo = yield UsuarioM.findByIdAndDelete(idMongo);
        res.status(200).json({
            msg: "Usuario borrado",
            usuarioMy,
            usuarioMo,
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
exports.borrarUsuarioPermanente = borrarUsuarioPermanente;
