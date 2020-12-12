const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');


exports.autenticarUsuarios = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Todos los campos son obligatorios'
});

//Funcion para revisar si el usuario esta logueado o no 
exports.usuarioAutenticado = (req, res, next) => {
        //si esta autentidado adelante
        if (req.isAuthenticated()) {
            return next();
        }
        //sino regresar al formulario
        return res.redirect('/iniciar-sesion')
    }
    //Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

//Generar token para recuperar contraseña, si el usario es valido 
exports.enviarToken = async(req, res) => {
    //Verificar que el usuario existe
    const { email } = req.body
    const usuario = await Usuarios.findOne({ where: { email } });
    console.log(usuario);

    //Si no existe el usario 
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/restablecer');
    }

    //Creando el token y la expiracion
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //gaurdarn en la base 
    await usuario.save();
    //url de reset
    const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

    //Envia el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'restablecer-password'
    });
    req.flash('correcto', 'Se envio un Correo con las instrucciones para cambiar tu Contraseña');
    res.redirect('/iniciar-sesion');
}

exports.resetPasswordForm = async(req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    if (!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/restablecer');
    }
    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Restablecer Contraseña'
    })

}

//Cambia el pass por uno nuevo
exports.actualizarPassword = async(req, res) => {
    //Verificia el token valido y la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
    // verificamos si existe el usuario
    if (!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/restablecer');
    }

    //guardar la nueva contraseña en hash

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash('correcto', 'Tu password se ha guardado correctamente');
    res.redirect('/iniciar-sesion');
}