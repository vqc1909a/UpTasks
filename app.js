const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {connectDB} = require('./config/db');
const helpers = require('./helpers');
const Proyecto = require('./models/ProyectoModel');
const User = require('./models/UserModel');

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MemoryStore = require('memorystore')(session)

const passport = require("./config/passport");
const verifyAuthentication = require('./middlewares/verifyAuthentication');

const flash = require("connect-flash");
//Crear el servidor
const app = express();
const port = process.env.PORT || 4000;

//Conectar DB  
connectDB()
.then(() => {
//Crear todas las tablas
//createTables();

//Establecer el tipo de vista
app.set('view engine', 'pug');
//Añadir la carpeta para las vistas
app.set('views', path.join(__dirname, './views'));

//! Habilitar Archivos Estáticos
//!El express json no funciona para peticiones a través del html form action, para ello se usa de forma nativa el paquete body parser
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname, "./src/public")));

//!Middlewares
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));
app.use(flash());   


//! Autenticar usuarios
app.use(cookieParser());

//! Session nos permite navegar entre distintas paginas sin volvernos a autenticar
const sess = {
     //!Te ayuda a firmar el cookie
     secret: "secret",
     //!Mantener la sesion viva
     resave: false,
     saveUninitialized: false,
     store: new MemoryStore({
          checkPeriod: 3600000 
     }),
     cookie: {
          maxAge: 3600000
     }
}

if (app.get('env') === 'production') {
     app.set('trust proxy', 1) // trust first proxy
     sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess));

app.use(passport.initialize());    
app.use(passport.session());


app.use((req, res, next) => {
     res.locals.vardump = helpers.vardump
     next(); 
})

//Rutas
app.use('/', require('./routes/proyectosRoute'));
app.use('/', require('./routes/tareasRoute'));
app.use('/', require('./routes/usersRoute'));
app.use('/', require('./routes/authRoute'));


//! Page not found - Siempre va despues de la rutas que tienen contenido, y sino viene aca abajo
app.use('/', verifyAuthentication.redirectContent, async (req, res) => {
     const user = await User.findOne({where: {id: req.user.id}});
     const proyectos = await Proyecto.findAll({where: {UserId: req.user.id}});
     res.render('pagenotfoundView', {
          nombrepagina: "Page Not Found",
          user,
          proyectos
     })
})

//Escuchar el puerto
app.listen(port, () => {
     console.log(`Server run on port ${port}`);
})

})

