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
exports.Dependencia = void 0;
const { Schema, model } = require("mongoose");
exports.Dependencia = Schema({
    dep_nombre: {
        type: String,
        required: true,
    },
    dep_descripcion: {
        type: String,
        required: true,
    },
    dep_estado: {
        type: Boolean,
        default: true,
    },
    idMYSQL: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
//desestructuracion para enviar solo las propiedas de la dependencia en un nuevo json
exports.Dependencia.methods.toJSON = function () {
    const _a = this.toObject(), { __v, _id } = _a, dependencia = __rest(_a, ["__v", "_id"]);
    dependencia.id = _id;
    return dependencia;
};
module.exports = model("Dependencia", exports.Dependencia);
