"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionMySql_1 = __importDefault(require("../../db/connectionMySql"));
const role_1 = __importDefault(require("./role"));
const tipoDocumento_1 = __importDefault(require("./tipoDocumento"));
const dependencia_1 = __importDefault(require("./dependencia"));
const Usuario = connectionMySql_1.default.define("Usuario", {
    username: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    numDocumento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    correo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
});
exports.default = Usuario;
// Define the associations
Usuario.belongsTo(role_1.default, { foreignKey: "roleId", as: "role" });
Usuario.belongsTo(dependencia_1.default, {
    foreignKey: "dependenciaId",
    as: "dependencia",
});
Usuario.belongsTo(tipoDocumento_1.default, {
    foreignKey: "tipoDocumentoId",
    as: "tipoDocumento",
});
