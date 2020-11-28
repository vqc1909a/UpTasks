const {check} = require('express-validator');

exports.loguearse = [
     check('email').trim().notEmpty().withMessage("El email es obligatorio").normalizeEmail().isEmail().withMessage("Ingrese un email válido"),
     check('password').trim().notEmpty().withMessage("El password es obligatorio").isLength({min: 8}).withMessage("El password debe tener como mínimo 8 dígitos").matches(/[1-9]/).withMessage("El password debe tener al menos un número")
];

exports.registrarse = [
     check('name').trim().notEmpty().withMessage("El nombre es obligatorio").escape(),
     check('email').trim().notEmpty().withMessage("El email es obligatorio").normalizeEmail().isEmail().withMessage("Ingrese un email válido"),
     check('password').trim().notEmpty().withMessage("El password es obligatorio").isLength({min: 8}).withMessage("El password debe tener como mínimo 8 dígitos").matches(/[1-9]/).withMessage("El password debe tener al menos un número"),
     check('confirm').trim().notEmpty().withMessage("Confirme el password")
];

exports.generarToken = [
     check('email').trim().notEmpty().withMessage("El email es obligatorio").normalizeEmail().isEmail().withMessage("Ingrese un email válido"),
]

exports.actualizarPassword = [
     check('password_nuevo').trim().notEmpty().withMessage("El nuevo password es obligatorio").isLength({
          min: 8
     }).withMessage("El nuevo password debe tener como mínimo 8 dígitos").matches(/[1-9]/).withMessage("El password nuevo debe tener al menos un número"),

     check('confirm').trim().notEmpty().withMessage("Confirme el password")
]
