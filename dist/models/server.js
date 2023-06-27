"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const connectionMySql_1 = __importDefault(require("../db/connectionMySql"));
const connectionMongo_1 = __importDefault(require("../db/connectionMongo"));
const index_1 = require("./MySQL/index");
const index_routes_1 = require("../routes/index.routes");
const dependencia_controller_1 = require("../controllers/dependencia.controller");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT;
        this.apiPaths = {
            auth: "/api/auth",
            dependencias: "/api/dependencias",
            estadoIncidencias: "/api/estadoIncidentes",
            incidentes: "/api/incidentes",
            roles: "/api/roles",
            tipoDocumentos: "/api/tipoDocumentos",
            tipoIncidentes: "/api/tipoIncidentes",
            usuarios: "/api/usuarios",
            buscar: "/api/buscar",
        };
        //conectar las bases de datos
        this.conectarDbMongo();
        this.conectarDBMySql();
        //MiddleWares
        this.middlewares();
        //Rutas de mi aplicacion
        this.routes();
        this.app.get("*", (req, res) => {
            res.sendFile(path_1.default.resolve(__dirname, "../public.index.html"));
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Aplicacion corriendo en el puerto " + this.port);
        });
    }
    routes() {
        this.app.use(this.apiPaths.auth, index_routes_1.authRoutes);
        this.app.use(this.apiPaths.dependencias, index_routes_1.dependenciaRoutes);
        this.app.use(this.apiPaths.estadoIncidencias, index_routes_1.estadoIncidenteRoutes);
        this.app.use(this.apiPaths.incidentes, index_routes_1.incidenteRoutes);
        this.app.use(this.apiPaths.roles, index_routes_1.roleRoutes);
        this.app.use(this.apiPaths.tipoDocumentos, index_routes_1.tipoDocumentoRoutes);
        this.app.use(this.apiPaths.tipoIncidentes, index_routes_1.tipoIncidenteRoutes);
        this.app.use(this.apiPaths.usuarios, index_routes_1.usuarioRoutes);
        this.app.use(this.apiPaths.buscar, index_routes_1.buscarRoutes);
    }
    middlewares() {
        // Cors
        this.app.use((0, cors_1.default)());
        //Lectura y parseo del body
        this.app.use(express_1.default.json());
        //Directorio publico
        this.app.use(express_1.default.static("public"));
    }
    conectarDBMySql() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //MYSQL
                yield connectionMySql_1.default.authenticate();
                console.log("<-----Base de datos MYSQL Online-----> ");
                this.sincronizarMySQL();
                process.env.MYSQLDB_ON = "true";
            }
            catch (error) {
                process.env.MYSQLDB_ON = "false";
                process.env.MAINDB_ON = "MONGO";
                console.error("No se pudo conectar a la base de datos MYSQL,se usara como respaldo MONGODB", error);
            }
        });
    }
    conectarDbMongo() {
        return __awaiter(this, void 0, void 0, function* () {
            //MONGODB
            try {
                yield (0, connectionMongo_1.default)();
                process.env.MONGODB_ON = "true";
            }
            catch (error) {
                process.env.MONGODB_ON = "false";
                process.env.MAINDB_ON = "MYSQL";
                // console.error("No se pudo conectar a la base de datos MONGODB:", error);
                console.error("No se pudo conectar a la base de datos MONGODB ,se usara como principal MYSQL");
            }
        });
    }
    sincronizarMySQL() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield index_1.Dependencia.sync();
                yield index_1.EstadoIncidente.sync();
                yield index_1.TipoIncidente.sync();
                yield index_1.Role.sync();
                yield index_1.TipoDocumento.sync();
                yield index_1.Usuario.sync();
                yield index_1.Incidente.sync();
            }
            catch (error) {
                console.log("No se pudo sincronizar la base de datos");
            }
        });
    }
    sincronizarBDs() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: TERMINAR LAS SINCRONIZACIONES
            try {
                yield (0, dependencia_controller_1.sincronizarTablaDependencia)();
            }
            catch (error) {
                console.log("No se pudo sincronizar la base de datos en paralelo");
            }
        });
    }
}
exports.default = Server;
