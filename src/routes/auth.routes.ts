

import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos";

import { login, expiradoToken, revalidarToken } from '../controllers/auth.controller';


import validarJWT from "../middlewares/validar-jwt";
import { enviarMensajeReq } from "../helpers/sendEmail";


const router = Router();

router.get ("/lunes", (req , res) => {
  res.send ("Hola")
});
//Obtener todos las dependencias registrados
router.post(
  "/login",
  [
    check("username", "El username es obligatorio").not().isEmpty(),
    check("password", "La contrasenia es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

// Validar y revalidar token de usuario 
router.get('/renew',validarJWT,revalidarToken  );

// Validar si ya expiro el token de usuario 
router.get('/expired' ,expiradoToken);

router.post('/sendEmail',validarJWT,enviarMensajeReq);

export default router;
