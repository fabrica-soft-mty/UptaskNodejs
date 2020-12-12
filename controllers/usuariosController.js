const Usuarios = require("../models/Usuarios");
const enviarEmail = require('../handlers/email');


exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en up Task'
    })
}

exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en up Task',
        error
    })
}

exports.crearCuenta = async(req, res) => {
    //ler los datos
    // console.log(req.body);
    const { email, password } = req.body;

    try {
        //Crear usuario
        await Usuarios.create({
            email,
            password
        });
        //Crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
            //crear el objeto de usuario
        const usuario = {
                email
            }
            //enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Conrima tu Cuenta en UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un Correo para confirmar tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        // console.log(error)
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        })
    }



}

exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu Contraseña'
    })
}

exports.confirmarCuenta = async(req, res) => {
    //Cambiar el estatus de una cuetna
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if (!usuario) {
        req.flash('error', 'no valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta activada Correctamente');
    res.redirect('/iniciar-sesion');
}