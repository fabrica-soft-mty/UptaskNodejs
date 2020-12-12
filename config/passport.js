const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

//Referencia al modelo dodne vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - login con credenciales poripos
passport.use(
    new localStrategy(
        //por defaut passport espera un usaurio y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                //El usario no existe, password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    });
                }
                //El email existe y el usuario es correcto
                return done(null, usuario);

            } catch (error) {
                //Ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

//Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

//Desserializar el usaurio
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;