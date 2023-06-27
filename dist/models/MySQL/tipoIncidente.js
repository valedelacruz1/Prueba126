"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionMySql_1 = __importDefault(require("../../db/connectionMySql"));
const TipoIncidente = connectionMySql_1.default.define("TipoIncidente", {
    tinc_nombre: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    tinc_descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    tinc_estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
});
exports.default = TipoIncidente;
