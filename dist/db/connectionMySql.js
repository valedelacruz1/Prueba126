"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dbMySQL = new sequelize_1.Sequelize("rrhh", "root", "vale1234", {
    host: "localhost",
    dialect: "mysql",
});
exports.default = dbMySQL;
