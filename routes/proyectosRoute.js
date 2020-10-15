

const express = require('express');
const Router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const proyectosValidate = require('../validations/proyectosValidate');
const {redirectContent} = require('../middlewares/verifyAuthentication');

Router.get('/', redirectContent, proyectosController.proyectos);
Router.get('/nuevo-proyecto', redirectContent, proyectosController.formularionuevoproyecto)
Router.post('/nuevo-proyecto', redirectContent, proyectosValidate.agregarProyecto, proyectosController.agregarProyecto);

Router.get('/proyectos/:url', redirectContent, proyectosController.obtenerTareasProyecto);
Router.post('/proyectos/:url', redirectContent, proyectosValidate.agregarProyecto, tareasController.agregarTareaProyecto);

Router.get('/proyectos/:url/edit', redirectContent, proyectosController.formularioeditproyecto);
Router.post('/proyectos/:url/edit', redirectContent, proyectosValidate.agregarProyecto, proyectosController.editarProyecto);
Router.delete('/proyectos/:url', redirectContent, proyectosController.eliminarProyecto);



module.exports = Router;