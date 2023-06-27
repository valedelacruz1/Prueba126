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
exports.enviarMensajeInsideServer = exports.enviarMensajeReq = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const enviarMensajeReq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, incidente, asunto } = req.body;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: usuario.correo,
        subject: "Incidente registro",
        text: "This is a test email sent from Node.js with NodeMailer and TypeScript.",
        html: " ",
    };
    try {
        // Send the email
        const info = yield transporter.sendMail(mailOptions);
        res.status(200).json({
            msg: `Incidente ${incidente.id}Registrado,por favor revise su correo ${usuario.correo} para hacer seguimiento al incidente`,
            usuario,
            info,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Hable con el administrador",
            BDStatus: {
                MYSQL_ON: process.env.MYSQLDB_ON,
                MONGODB_ON: process.env.MONGODB_ON,
            },
        });
    }
});
exports.enviarMensajeReq = enviarMensajeReq;
const enviarMensajeInsideServer = (usuarioDestino, asunto, incidente) => __awaiter(void 0, void 0, void 0, function* () {
    let mailOptions, info;
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.EMAIL_SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // Define the email options
    try {
        // Send the email
        switch (asunto) {
            case "Registro de Incidente":
                mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: usuarioDestino.correo,
                    subject: asunto,
                    html: `<html>
          <head>
            <meta charset="utf-8">
            <title>${asunto} </title>
          </head>
          <body>
            <h1>Nuevo Incidente Registrado.</h1>
            <p>Asunto Incidente,Ticket${incidente.id}, ${incidente.inc_nombre},revisar en cuanto pueda la plataforma.</p>
            <p>Ir a plataforma: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
            
          </body>
        </html>`,
                };
                info = yield transporter.sendMail(mailOptions);
                break;
            case "Actualizacion de Incidente":
                mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: usuarioDestino.correo,
                    subject: asunto,
                    // text: `Tu Incidente ${incidente.inc_nombre} ha sido actualizado por un Administrador. text`,
                    html: `<html>
            <head>
              <meta charset="utf-8">
              <title>${asunto} titulo</title>
            </head>
            <body>
              <h1>¡Hola, ${usuarioDestino.nombre}!</h1>
              <p>Tu Incidente con Ticket #${incidente.id}, ${incidente.inc_nombre} ha sido actualizado por un Administrador.</p>
              <p>Se te ha asignado un tecnico que te asistira en tu incidente.</p>
              
              <p>Ingresa a la plataforma para ver su estado: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
              <p>¡Gracias por utilizar Nodemailer!</p>
            </body>
          </html>`,
                };
                info = yield transporter.sendMail(mailOptions);
                break;
            case "Asignacion de Incidente":
                mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: usuarioDestino.correo,
                    subject: asunto,
                    // text: `Tu Incidente ${incidente.inc_nombre} ha sido actualizado por un Administrador. text`,
                    html: `<html>
              <head>
                <meta charset="utf-8">
                <title>${asunto} titulo</title>
              </head>
              <body>
                <h1>¡Hola, TECNICO ${usuarioDestino.nombre}!</h1>
    
                <p>Se le ha asignado un incidente para resolver,por favor revise la plataforma.</p>
                <p>Ingresa a la plataforma para ver su estado: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
                
              </body>
            </html>`,
                };
                info = yield transporter.sendMail(mailOptions);
                break;
            case "Registro de Usuario":
                mailOptions = {
                    from: process.env.EMAIL_USERNAME,
                    to: usuarioDestino.correo,
                    subject: asunto,
                    // text: `Tu Incidente ${incidente.inc_nombre} ha sido actualizado por un Administrador. text`,
                    html: `<html>
              <head>
                <meta charset="utf-8">
                <title>${asunto} titulo</title>
              </head>
              <body>
                <h1>¡Hola, ${usuarioDestino.nombre}!</h1>
                <p>Se te ha creado un usuario para ingresar a la plataforma Gestor de Incidentes, con tu correo ${usuarioDestino.correo} por un Administrador.</p>
                <p>Datos de Ingreso: 
                <br>
                <p>Usuario: ${usuarioDestino.username}</p>
                <br>
                <p>password: ${usuarioDestino.password}</p>
                
                <p>Ingresa a la plataforma para ver su estado: <a href="http://localhost:3001/auth/login">Plataforma de Gestor de Incidentes</a></p>
                <p>¡Gracias por utilizar Nodemailer!</p>
              </body>
            </html>`,
                };
                info = yield transporter.sendMail(mailOptions);
                break;
            default:
                break;
        }
        // console.log(info);
    }
    catch (error) {
        console.log(error);
    }
});
exports.enviarMensajeInsideServer = enviarMensajeInsideServer;
