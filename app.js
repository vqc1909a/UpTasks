const express = require('express');
const proyectosRoute = require('./routes/proyectosRoute');
const tareasRoute = require('./routes/tareasRoute');
const usersRoute = require('./routes/usersRoute');
const authRoute = require('./routes/authRoute');
const path = require('path');
const bodyParser = require('body-parser');
const {connectDB, createTables} = require('./config/db');
const helpers = require('./helpers');
const Proyecto = require('./models/ProyectoModel');



const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("./config/passport");
const flash = require("connect-flash");
const verifyAuthentication = require('./middlewares/verifyAuthentication');


//Crear el servidor
const app = express();
const port = process.env.PORT || 4000;

//Conectar DB
connectDB();

//Crear todas las tablas
createTables();

//Establecer el tipo de vista
app.set('view engine', 'pug');
//Añadir la carpeta para las vistas
app.set('views', path.join(__dirname, './views'));


//Middlewares
app.use(express.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(flash());

app.use((req, res, next) => {
     res.locals.vardump = helpers.vardump
     next(); 
})

//! Autenticar usuarios
app.use(cookieParser());

//! Session nos permite navegar entre distintas paginas sin vovernos a autenticasr
const sess = {
   //!Te ayuda a firmar el cookie
   secret: "secret",
   //!Mantener la sesion viva
   resave: false,
   saveUninitialized: false,
   cookie: {
        maxAge: 3600000
   }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

app.use(passport.initialize());
app.use(passport.session()); 

//Rutas
app.use('/', proyectosRoute);
app.use('/', tareasRoute);
app.use('/', usersRoute);
app.use('/', authRoute);


//Page not found
app.use('/', verifyAuthentication.redirectContent, async (req, res) => {
     const proyectos = await Proyecto.findAll();
     res.render('pagenotfoundView', {
          nombrepagina: "Page Not Found",
          proyectos
     })
})

//Escuchar el puerto
app.listen(port, () => {
     console.log(`Server run on port ${port}`);
})
