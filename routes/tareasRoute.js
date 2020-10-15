const express = require('express');
const Router = express.Router();
const tareasController = require('../controllers/tareasController');

Router.patch('/tareas/:id', tareasController.actualizarEstado);
Router.delete('/tareas/:id', tareasController.eliminarTarea);
module.exports = Router;