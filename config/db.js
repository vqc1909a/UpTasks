const { Sequelize } = require('sequelize');
require('dotenv').config({path: "variables.env"});

const sequelize = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASS, {
     host: process.env.BD_HOST,
     port: process.env.BD_PORT,
     dialect: 'mysql',
     define: { 
          timestamps: false
     }
});
const connectDB = async () => {
     try {     
          await sequelize.authenticate();
          console.log('Connection has been established successfully.');
     } catch (error) {
          console.error('Unable to connect to the database:', error);
     }
}

const createTables = async () => {
     try{
          await sequelize.sync({alter: true});
          console.log("Tablas creadas correctamente");
     }catch(err){
          console.log(err.message);
     }
}
module.exports = {connectDB, createTables, sequelize};
     