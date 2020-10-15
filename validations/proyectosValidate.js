const {check} = require('express-validator');

exports.agregarProyecto = [
     check('name').trim().notEmpty().withMessage('El nombre es obligatorio').escape()
]