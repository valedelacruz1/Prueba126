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
exports.validarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getModelo_1 = require("../helpers/getModelo");
const { UsuarioM } = require("../models/MongoDB/index");
const validarJWT = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "No hay token en la peticion",
        });
    }
    try {
        const { id } = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        const query = {
            id,
            estado: true,
        };
        //leer el usuario que corresponde al id
        let usuario = yield (0, getModelo_1.getModeloBD)("usuario", query, "MYSQL");
        // const usuario: any = await UsuarioM.find(query)
        //   .populate("role", ["idMYSQL", "rol_nombre", "rol_descripcion "])
        //   .populate("dependencia", [
        //     "idMYSQL",
        //     "dep_nombre",
        //     "dep_descripcion",
        //     "role",
        //   ])
        //   .populate("tipoDocumento", [
        //     "idMYSQL",
        //     "tdoc_nombre",
        //     "tdoc_descripcion",
        //   ]);
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no valido - Usuario no existe en la base de datos.",
            });
        }
        //Verificar si el usuario esta activo
        if (usuario.estado === false) {
            return res.status(401).json({
                msg: "Token no valido - Usuario no activo",
            });
        }
        req.id = id;
        req.usuario = usuario;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Token no valido",
        });
    }
});
exports.validarJWT = validarJWT;
exports.default = exports.validarJWT;
