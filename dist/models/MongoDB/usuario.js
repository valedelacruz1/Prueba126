"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const { Schema, model } = require("mongoose");
exports.Usuario = Schema({
    username: {
        type: String,
        allowNull: false,
        unique: true,
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        allowNull: false,
        required: [true, "La contraseña es requerida"],
    },
    nombre: {
        type: String,
        required: [true, "El nombre es obligatorio"],
    },
    apellido: {
        type: String,
        required: [true, "El apellido es obligatorio"],
    },
    numDocumento: {
        type: String,
        required: [true, "El numero de documento es obligatorio"],
    },
    telefono: {
        type: String,
        required: [true, "El numero de telefono es requerido"],
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
    },
    dependencia: {
        type: Schema.Types.ObjectId,
        ref: "Dependencia",
    },
    tipoDocumento: {
        type: Schema.Types.ObjectId,
        ref: "TipoDocumento",
        required: true,
    },
    idMYSQL: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: Boolean,
        defaultValue: true,
    },
});
//desestructuracion para enviar solo las propiedas del usuario en un nuevo json
exports.Usuario.methods.toJSON = function () {
    const _a = this.toObject(), { __v, password, _id } = _a, usuario = __rest(_a, ["__v", "password", "_id"]);
    usuario.id = _id;
    return usuario;
};
module.exports = model("Usuario", exports.Usuario);
