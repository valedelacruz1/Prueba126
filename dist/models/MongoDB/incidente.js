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
exports.Incidente = void 0;
const { Schema, model } = require("mongoose");
exports.Incidente = Schema({
    inc_nombre: {
        type: String,
        required: [true, "Nombre de incidente obligatorio"],
    },
    inc_descripcion: {
        type: String,
        required: [true, "Descripcion de incidente obligatorio"],
    },
    inc_estado: {
        type: Boolean,
        default: true,
    },
    inc_tipoIncidente: {
        type: Schema.Types.ObjectId,
        ref: "TipoIncidente",
        required: [true, "Tipo de Solicitud de incidente obligatorio"],
    },
    inc_estadoIncidente: {
        type: Schema.Types.ObjectId,
        ref: "EstadoIncidente",
        required: [true, "Estado de incidente obligatorio"],
    },
    inc_usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
    },
    inc_usuarioRevision: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
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
//desestructuracion para enviar solo las propiedas del incidente en un nuevo json
exports.Incidente.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, incidente = __rest(_a, ["__v", "_id"]);
    incidente.id = _id;
    return incidente;
};
module.exports = model("Incidente", exports.Incidente);
