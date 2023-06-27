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
exports.Role = void 0;
const { Schema, model } = require("mongoose");
exports.Role = Schema({
    rol_nombre: {
        type: String,
        enum: ["ADMIN_ROLE", "USER_ROLE", "TECNICO"],
        require: [true, "El Rol es Obligatorio"],
    },
    rol_descripcion: {
        type: String,
        require: [true, "Descripcion de Rol es Requerido"],
    },
    rol_estado: {
        type: Boolean,
        default: true,
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
});
//desestructuracion para enviar solo las propiedas del role en un nuevo json
exports.Role.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, role = __rest(_a, ["__v", "_id"]);
    role.id = _id;
    return role;
};
module.exports = model("Role", exports.Role);
