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
exports.TipoDocumento = void 0;
const { Schema, model } = require("mongoose");
exports.TipoDocumento = Schema({
    tdoc_nombre: {
        type: String,
        required: [true, "El nombre de documento es requerido"],
        unique: true,
        enum: ["CC", "CE", "TI", "PA"],
    },
    tdoc_descripcion: {
        type: String,
        required: [true, "La descripcion de documento es requerida"],
    },
    tdoc_estado: {
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
//desestructuracion para enviar solo las propiedas del Tipo documento en un nuevo json
exports.TipoDocumento.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, tipoDocumento = __rest(_a, ["__v", "_id"]);
    tipoDocumento.id = _id;
    return tipoDocumento;
};
module.exports = model("TipoDocumento", exports.TipoDocumento);
