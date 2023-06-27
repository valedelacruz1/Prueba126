"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connectionMySql_1 = __importDefault(require("../../db/connectionMySql"));
const usuario_1 = __importDefault(require("./usuario"));
const tipoIncidente_1 = __importDefault(require("./tipoIncidente"));
const estadoIncidente_1 = __importDefault(require("./estadoIncidente"));
const Incidente = connectionMySql_1.default.define("Incidente", {
    inc_nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    inc_descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    inc_estado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
});
exports.default = Incidente;
// Define the associations
Incidente.belongsTo(usuario_1.default, {
    foreignKey: "inc_usuarioId",
    as: "inc_usuario",
});
Incidente.belongsTo(usuario_1.default, {
    foreignKey: "inc_usuarioRevisionId",
    as: "inc_usuarioRevision",
});
Incidente.belongsTo(tipoIncidente_1.default, {
    foreignKey: "inc_tipoIncidenteId",
    as: "inc_tipoIncidente",
});
Incidente.belongsTo(estadoIncidente_1.default, {
    foreignKey: "inc_estadoIncidenteId",
    as: "inc_estadoIncidente",
});
