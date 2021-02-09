const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator')

//Crear una tarea nueva
exports.crearTarea = async (req, res) => {

    //Validación de errores
    const errores = validationResult(req);
        if(!errores.isEmpty() ) {
    return res.status(400).json({errores: errores.array()})
    }
    
    // Extraer el proyecto y validar si existe
    const {proyecto} = req.body;

    try {

        // Extraer el proyecto y validar si existe
        const {proyecto} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Verifica que el proyecto actual sea del usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No tienes los permisos necesarios'})
        }

        //Crear la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error')
    }
}

//Obetere las tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    try {
        // Extraer el proyecto y validar si existe
        const {proyecto} = req.query;

        const existeProyecto = await Proyecto.findById(proyecto)
        if(!existeProyecto) {
            return res.status(404).json({msg: 'Proyecto no encontrado'})
        }

        //Verifica que el proyecto actual sea del usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No tienes los permisos necesarios'})
        }

        //Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({creado: -1});
        res.json({tareas})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualizar una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y validar si existe
        const {proyecto, nombre, estado} = req.body;
        
        //Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'No Existe esa tarea'})
        }

        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)

        //Verifica que el proyecto actual sea del usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No tienes los permisos necesarios'})
        }
        
        //Crear un objeto con la info actualizada
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre
        nuevaTarea.estado = estado

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id : req.params.id}, nuevaTarea, {new: true});
        res.json({tarea})

    } 
    catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}

//Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        // Extraer el proyecto y validar si existe
        const {proyecto} = req.query;
    
        //Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);

        if(!tarea) {
            return res.status(404).json({msg: 'No Existe esa tarea'})
        }

        //Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto)

        //Verifica que el proyecto actual sea del usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({msg: 'No tienes los permisos necesarios'})
        }

        //Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})

    } 
    catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }
}