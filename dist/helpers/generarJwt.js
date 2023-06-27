"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expiredJWT = exports.generarJWT = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { Request, Response } from "express";
const generarJWT = (id = "") => {
    return new Promise((resolve, reject) => {
        const payload = {
            id,
        };
        jsonwebtoken_1.default.sign(payload, process.env.SECRET_KEY, {
            expiresIn: "4h",
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject("No se pudo generar el token");
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.generarJWT = generarJWT;
const expiredJWT = (token = "") => {
    if (!token) {
        return express_1.response.status(400).json({
            msg: "No hay token en la peticion",
        });
    }
    try {
        const tokenResp = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        console.log(tokenResp);
        let expirado = false;
        //   if (tokenResp.exp > Date.now()) {
        //     return expirado;
        //   }
        // return expirado;
    }
    catch (error) {
        // expirado=true
        return error;
    }
};
exports.expiredJWT = expiredJWT;
