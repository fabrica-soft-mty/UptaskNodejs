const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.proyectosHome = async(req, res) => {
    //Console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async(req, res) => {
    //Enviar a la consola lo que se escribe en el Formulario
    // console.log(req.body);

    //validar que hay algo 
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' });
    }
    // si hay erroes
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //No hay error
        //Insertar en la DB
        // Proyectos.create({ nombre })
        //     .then(() => console.log('Insertando'))
        //     .catch(error => console.log(error));
        //
        // const url = slug(nombre).toLocaleLowerCase();

        //Con async Await
        //Usuario autenticado
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');


    }

}

exports.proyectoPorUrl = async(req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromis = Proyectos.findAll({ where: { usuarioId } });

    const proyectoPromis = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromis, proyectoPromis]);
    //Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // include: [
        //     { model: Proyectos }
        // ]
    });
    // console.log(tareas);

    if (!proyecto) {
        return next();
    }
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
}

exports.fomularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromis = Proyectos.findAll({ where: { usuarioId } });
    const proyectoPromis = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromis, proyectoPromis]);
    //render a la visita
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
}

exports.actulizarProyecto = async(req, res) => {
    //Enviar a la consola lo que se escribe en el Formulario
    // console.log(req.body);

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId } });
    const { nombre } = req.body;
    let errores = [];

    if (!nombre) {
        errores.push({ 'texto': 'Agrega un Nombre al Proyecto' });
    }
    // si hay erroes
    if (errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        //No hay error
        //Insertar en la DB
        // Proyectos.create({ nombre })
        //     .then(() => console.log('Insertando'))
        //     .catch(error => console.log(error));
        //
        // const url = slug(nombre).toLocaleLowerCase();

        //Con async Await
        await Proyectos.update({ nombre }, { where: { id: req.params.id } });
        res.redirect('/');


    }

}

exports.eliminarProyecto = async(req, res, next) => {
    //req contiene la info puedes utiizar query o params
    // console.log(req.query);
    const { urlProyecto } = req.query;
    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

    if (!resultado) {
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}