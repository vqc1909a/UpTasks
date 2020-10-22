const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/db');
const Proyecto = require('./ProyectoModel');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
     id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
     },
     googleId: {
          type: DataTypes.STRING,
     },
     name: {
          type: DataTypes.STRING,
          allowNull: false,
     },
     email: {
          type: DataTypes.STRING,
     },
     password: {
          type: DataTypes.STRING,
     },
     activo: {
          type: DataTypes.INTEGER,
          defaultValue: 0
     },
     token: DataTypes.STRING,
     expiracion: DataTypes.DATE
},
{
     hooks: {
          beforeCreate(user) {
               if(user.password){
                    const hash = bcrypt.hashSync(user.password, 10);
                    user.password = hash;
               }
          }
     }
})

User.prototype.verificarPassword = function(password){
     return bcrypt.compareSync(password,  this.password);
}

User.hasMany(Proyecto);

module.exports = User;