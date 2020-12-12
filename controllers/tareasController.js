const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async(req, res) => {
    //obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
    //leer el valor del input
    const { tarea } = req.body;
    //Estado de la tarea y id del proyecto
    const estado = 0;
    const proyectoId = proyecto.id
        //Insertar en la bd
    const resultado = await Tareas.create({ tarea, estado, proyectoId });
    if (!resultado) {
        return next();
    }

    //redireccionar
    res.redirect(`/proyectos/${req.params.url}`)
}

exports.cambiarEstadoTarea = async(req, res) => {
    // console.log(req.params);
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id: id } });
    // console.log(tarea);
    let estado = 0;
    if (tarea.estado === estado) {
        estado = 1;
    }
    tarea.estado = estado;
    const resultado = await tarea.save();
    if (!resultado) return next();

    res.status(200).send('Actulizando');
}

exports.eliminarTarea = async(req, res) => {
    // console.log(req.query); tambien puede ser con query
    const { id } = req.params;
    //Eliminar Tarea
    const resultado = await Tareas.destroy({ where: { id } }); //con object literal
    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
}