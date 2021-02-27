const Proyecto = require('../models/ProyectoModel');
const Tarea = require('../models/TareaModel');
const {validationResult} = require('express-validator');

exports.agregarTareaProyecto = async (req, res, next) => {
     try {
          const proyectos = await Proyecto.findAll({where: {UserId: req.user.id}});
          const proyecto = await Proyecto.findOne({
               where: {
                    url: req.params.url
               }
          })
          const tareas = await Tarea.findAll({where: {ProyectoId: proyecto.id}});
          const errors = validationResult(req);
          if (errors.errors.length !== 0) {
               return res.render('tareasproyectoView', {
                         nombrepagina: "Tareas del Proyecto",
                         proyecto,
                         proyectos,
                         tareas,
                         error: errors.array()[0].msg
                    })   
          } else {
              const tarea = await Tarea.build(req.body);
              tarea.ProyectoId = proyecto.id;
              await tarea.save();
              return res.redirect(`/proyectos/${proyecto.url}`)
          }
     } catch (err) {
          console.log(err.message);
          return res.render('tareasproyectoView', {
               nombrepagina: "Tareas del Proyecto",
               proyecto,
               proyectos,
               tareas,
               error: "Ocurrió un error"
          }) 
     }
}

exports.actualizarEstado = async (req, res) => {
     try{
          const tarea = await Tarea.findOne({where: {id: req.params.id}});
          tarea.estado = !tarea.estado
          await tarea.save();
          return res.status(200).send("Tarea Actualizada");
     }catch(err){
          console.log(err.message);
          return res.status(404).send(err.message);
     }
}

exports.eliminarTarea = async (req, res) => {
     try{
          await Tarea.destroy({where: {id: req.params.id}});
          return res.status(200).send("Tarea eliminada");        
     }catch(err){
          return res.status(404).send(err.message);
     }
}
