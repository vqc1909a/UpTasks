const User = require('../models/UserModel');
const Proyecto = require('../models/ProyectoModel');
const Tarea = require('../models/TareaModel');
const {validationResult} = require('express-validator');

exports.proyectos = async (req, res, next) => {
     try{
          const proyectos = await Proyecto.findAll({where: {UserId: req.user.id}});
          return res.render('indexView', {
               nombrepagina: "Proyectos",
               user: req.user,
               proyectos 
          });
     }catch(err){
          console.log(err.message);
          return next();
     }
}
exports.formularionuevoproyecto = async (req, res, next) => {
     try{
          const flash = req.flash();
          let error;
          if(flash.error){
               error = flash.error[0];
          }
          const proyectos = await Proyecto.findAll({where: {UserId: req.user.id}});
          return res.render('nuevoproyectoView', {
               nombrepagina: "Nuevo Proyecto",
               proyectos,
               error
          });
     }catch(err){
          console.log(err.message);     
          return next();
     }
}

exports.agregarProyecto = async (req, res, next) => {
     try{
          let error;
          const errors = validationResult(req);
          if(errors.errors.length !== 0){
               error = errors.array()[0].msg;
          }
          if(error){
               req.flash("error", error);
               return res.redirect('/nuevo-proyecto');
          }else{
               const proyecto = await Proyecto.build(req.body);
               proyecto.UserId = req.user.id;
               await proyecto.save();
               return res.redirect('/');
          }    
     }catch(err){
          console.log(err.message);
          req.flash('error', 'Hubo un error');
          return res.redirect('/nuevo-proyecto');
     }
}


exports.obtenerTareasProyecto = async (req, res, next) => {
     try{
          const proyectos = await Proyecto.findAll({where: {UserId: req.user.id}});
          const proyecto = await Proyecto.findOne({where: {url: req.params.url}});
          const tareas = await Tarea.findAll({where: {ProyectoId: proyecto.id}, include: [{model: Proyecto}]});
          
          if(!proyecto){
               return res.render('pagenotfoundView', {
                    nombrepagina: "Page Not Found",
                    proyectos,
               })
          }else{
               return res.render('tareasproyectoView', {
                    nombrepagina: "Tareas del Proyecto",
                    proyectos,
                    proyecto,
                    tareas
               })
          }
     }catch(err){
          console.log(err.message);
          return next();
     }
}



exports.formularioeditproyecto = async (req, res, next) => {
     try{
          const proyectos = await Proyecto.findAll({where: {UserId: req.user.id}});
          const proyecto = await Proyecto.findOne({where: {url: req.params.url}});
          if(!proyecto){
               return next()
          }else{
               return res.render('nuevoproyectoView', {
                    nombrepagina: "Editar Proyecto",
                    proyectos,
                    proyecto
               })
          }
     }catch(err){
          console.log(err.message);
          return next();
     }
}

exports.editarProyecto = async (req, res, next) => {
     try {
          const proyectos = await Proyecto.findAll({where: {UserId: req.user.id}});
          const proyecto = await Proyecto.findOne({
               where: {
                    url: req.params.url
               }
          });
          const errors = validationResult(req);
          if(errors.errors.length !== 0){
               return res.render('nuevoproyectoView', {
                    nombrepagina: "Editar Proyecto",
                    proyectos,
                    proyecto,
                    error:errors.array()[0].msg
               })
          }else{
               await Proyecto.update({name: req.body.name}, {where: {id: proyecto.id}})
               return res.redirect("/");
          }
     } catch (err) {
          console.log(err.message);
          return next();
     }
}

exports.eliminarProyecto = async (req, res, next) => {
     try{
          const proyecto = await Proyecto.findOne({where: {url: req.params.url}})
          await Tarea.destroy({where: {ProyectoId: proyecto.id}});
          await Proyecto.destroy({where: {url: req.params.url}});
          return res.status(200).send("Proyecto Eliminado")
     }catch(err){
          return res.status(404).send(err.message);
     }
}
