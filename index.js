const express = require('express');
const routes = require('./routes/index');
const path = require('path');
const bodyParser = require('body-parser');
// const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//helpers con funciones
const helpers = require('./helpers');
const passport = require('./config/passport');
//Env
require('dotenv').config({ path: 'variables.env' });
//Crear la conezion a la BD
const db = require('./config/db');
//Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
db.sync();


//crear una app de express
const app = express();

//Donde cargar los archivos staticos
app.use(express.static('public'));
//habilitar pug
app.set('view engine', 'pug');

//Habilitar body parser para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

//Agregar express validator a toda la aplicacion
// app.use(expressValidator());


//Añadir vistas
app.set('views', path.join(__dirname, './views'));

//agregando flash messages
app.use(flash());

app.use(cookieParser());
//sesiones permiten navegar entre distitnas paginas sin vovler a autentificar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));
//Inicializa passport
app.use(passport.initialize());
app.use(passport.session());

//pasar vardump a la aplicacion
app.use((req, res, next) => {

    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user } || null;
    console.log(res.locals.usuario);
    next();
});
//Aprendiendo middleware pasando una variable con el año
app.use((req, res, next) => {
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});

app.use('/', routes());

//purto en el que arranca el servidor de desarrollo
// app.listen(4000);
// Puerto y host para la app
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '3000';
app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
});