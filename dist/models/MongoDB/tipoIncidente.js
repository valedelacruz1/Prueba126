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
exports.TipoIncidente = void 0;
const { Schema, model } = require("mongoose");
exports.TipoIncidente = Schema({
    tinc_nombre: {
        type: String,
        required: [true, "El nombre de documento es requerido"],
        unique: true,
    },
    tinc_descripcion: {
        type: String,
        required: [true, "La descripcion de documento es requerida"],
    },
    tinc_estado: {
        type: Boolean,
        default: true,
        required: true,
    },
    idMYSQL: {
        type: Number,
        required: true
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
//desestructuracion para enviar solo las propiedades del tipoIncidente en un nuevo json
exports.TipoIncidente.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, tipoIncidente = __rest(_a, ["__v", "_id"]);
    tipoIncidente.id = _id;
    return tipoIncidente;
};
module.exports = model("TipoIncidente", exports.TipoIncidente);
