const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');
const slug = require("slug");
const shortid = require('shortid');

const Proyecto = sequelize.define('Proyecto', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
     },
     name: DataTypes.STRING,
     url: DataTypes.STRING
},{
     hooks: {
          beforeCreate(proyecto){
               const url = slug(proyecto.name).toLowerCase();
               proyecto.url = `${url}-${shortid.generate()}`
          }
     }
}) 

module.exports = Proyecto;