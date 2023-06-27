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
exports.expiradoToken = exports.revalidarToken = exports.obtenerRole = exports.login = void 0;
const usuario_1 = __importDefault(require("../models/MySQL/usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generarJwt_1 = require("../helpers/generarJwt");
const role_1 = __importDefault(require("../models/MySQL/role"));
const dependencia_1 = __importDefault(require("../models/MySQL/dependencia"));
const tipoDocumento_1 = __importDefault(require("../models/MySQL/tipoDocumento"));
const { UsuarioM, RoleM } = require("../models/MongoDB/index");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //verificar si el username existe
        //MYSQL
        const usuarioMy = yield usuario_1.default.findOne({
            where: { username },
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
        //MONGODB
        let usuarioMo = yield UsuarioM.findOne({ username: username })
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
        if (!usuarioMy || !usuarioMo) {
            return res.status(400).json({
                msg: "Usuario / Contraseña no son correctos ",
                // username(borrar luego)
            });
        }
        //Si el usuario esta activo
        if (usuarioMy.estado === false || usuarioMo.estado === false) {
            return res.status(400).json({
                msg: "Usuario / Contraseña no son correctos ",
                // - estado:false(borrar luego)
            });
        }
        //Verificar la contrasenia
        const validPassword = bcrypt_1.default.compareSync(password, usuarioMy.password);
        const validPasswordMo = bcrypt_1.default.compareSync(password, usuarioMo.password);
        if (!validPassword || !validPasswordMo) {
            return res.status(400).json({
                msg: "Usuario / Contraseña no son correctos",
                // - password(borrar luego)
            });
        }
        //Generar el JWT
        let usuarioToken;
        if (!usuarioMy) {
            usuarioToken = usuarioMo;
        }
        else {
            usuarioToken = usuarioMy;
        }
        const token = yield (0, generarJwt_1.generarJWT)(usuarioToken.id);
        //Obtener Rol
        const roleBD = yield (0, exports.obtenerRole)(usuarioToken);
        res.status(200).json({
            msg: "Login ok",
            usuarioMy,
            usuarioMo,
            role: roleBD,
            token,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Hable con el administrador",
        });
    }
});
exports.login = login;
const obtenerRole = (usuarioToken) => __awaiter(void 0, void 0, void 0, function* () {
    const usuarioRol = yield role_1.default.findOne({
        where: { id: usuarioToken.roleId },
    });
    const usuarioRolM = yield RoleM.findOne({
        where: { idMYSQL: usuarioToken.roleId },
    });
    let roleBD = undefined;
    if (!usuarioRol) {
        roleBD = usuarioRolM.rol_nombre;
    }
    else {
        roleBD = usuarioRol.rol_nombre;
    }
    return roleBD;
});
exports.obtenerRole = obtenerRole;
const revalidarToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    // leer la base de datos
    //MYSQL
    let usuarioMy = yield usuario_1.default.findOne({
        where: { id },
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
    //MONGODB
    const usuarioMo = yield UsuarioM.findOne({ idMYSQL: id })
        .populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "])
        .populate("dependencia", ["idMYSQL", "dep_nombre", "dep_descripcion"])
        .populate("tipoDocumento", ["idMYSQL", "tdoc_nombre", "tdoc_descripcion"]);
    let usuarioToken;
    if (!usuarioMy) {
        usuarioToken = {
            id: usuarioMo.idMYSQL,
            role: usuarioMo.role.rol_nombre,
        };
    }
    else {
        usuarioToken = {
            id: usuarioMy.id,
            role: usuarioMy.role.rol_nombre,
        };
    }
    // Generar el JWT
    const token = yield (0, generarJwt_1.generarJWT)(usuarioToken.id);
    return res.status(200).json({
        ok: true,
        usuarioMy,
        usuarioMo,
        role: usuarioToken.role,
        token,
    });
});
exports.revalidarToken = revalidarToken;
const expiradoToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("x-token");
    const expirado = yield (0, generarJwt_1.expiredJWT)(token);
    if (expirado) {
        res.json({
            ok: false,
            msg: "El Token ha expirado",
        });
    }
    else {
        res.json({
            ok: true,
            msg: "Token no ha expirado",
        });
    }
});
exports.expiradoToken = expiradoToken;
