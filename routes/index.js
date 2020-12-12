const express = require('express');
const router = express.Router();
// importar express validator
const { body } = require('express-validator/check');

// importar controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    router.get('/',
        authController.usuarioAutenticado,
        proyectosController.proyectosHome);
    router.get('/nuevo-proyecto', authController.usuarioAutenticado, proyectosController.formularioProyecto);
    router.post('/nuevo-proyecto', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.nuevoProyecto);

    //listar Proyecto
    router.get('/proyectos/:url', authController.usuarioAutenticado, proyectosController.proyectoPorUrl);

    //Actulizr el Proyecto
    router.get('/proyectos/editar/:id', authController.usuarioAutenticado, proyectosController.fomularioEditar);
    router.post('/nuevo-proyecto/:id', authController.usuarioAutenticado, body('nombre').not().isEmpty().trim().escape(), proyectosController.actulizarProyecto);

    //Eliminar proyecto
    router.delete('/proyectos/:url', authController.usuarioAutenticado, proyectosController.eliminarProyecto);
    //Agregar Tareas
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea);
    //Actulizar tareas
    router.patch('/tareas/:id', authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);
    //Eliminar tareas
    router.delete('/tareas/:id', authController.usuarioAutenticado, tareasController.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //iniciar sesión
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuarios);

    //Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);
    //Restablecer contraseña
    router.get('/restablecer', usuariosController.formRestablecerPassword);
    router.post('/restablecer', authController.enviarToken);
    router.get('/restablecer/:token', authController.resetPasswordForm);
    router.post('/restablecer/:token', authController.actualizarPassword);


    return router;
};