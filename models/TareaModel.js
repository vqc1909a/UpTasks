const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');
const Proyecto = require('./ProyectoModel');
const Tarea = sequelize.define("Tarea", {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
     },
     name: DataTypes.STRING,
     estado: {
          type: DataTypes.BOOLEAN,
          defaultValue: 0
     }

})
Tarea.belongsTo(Proyecto);
// Tarea.belongsTo(Proyecto)

module.exports = Tarea;
