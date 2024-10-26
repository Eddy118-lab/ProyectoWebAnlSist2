import Proyecto from '../models/Proyecto.js';

// Obtener todos los proyectos
export const getProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.findAll();
        return res.status(200).json(proyectos);
    } catch (error) {
        console.error('Error al obtener los proyectos:', error);
        return res.status(500).json({ message: 'Error al obtener los proyectos.' });
    }
};

// Obtener un proyecto por ID
export const getProyectoById = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findByPk(id);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        return res.status(200).json(proyecto);
    } catch (error) {
        console.error('Error al obtener el proyecto:', error);
        return res.status(500).json({ message: 'Error al obtener el proyecto.' });
    }
};

// Crear un nuevo proyecto
export const createProyecto = async (req, res) => {
    try {
        const { nombre, descripcion, estado, fecha_inicio, fecha_fin, fecha_ult_actua } = req.body;

        if (!nombre || !estado || !fecha_inicio || !fecha_ult_actua) {
            return res.status(400).json({ message: 'Los campos obligatorios son requeridos.' });
        }

        const nuevoProyecto = await Proyecto.create({
            nombre,
            descripcion,
            estado,
            fecha_inicio,
            fecha_fin,
            fecha_ult_actua
        });

        return res.status(201).json(nuevoProyecto);
    } catch (error) {
        console.error('Error al crear el proyecto:', error);
        return res.status(500).json({ message: 'Error al crear el proyecto.' });
    }
};

// Actualizar un proyecto
export const updateProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, estado, fecha_inicio, fecha_fin, fecha_ult_actua } = req.body;

        const proyecto = await Proyecto.findByPk(id);
        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        if (!nombre || !estado || !fecha_inicio || !fecha_ult_actua) {
            return res.status(400).json({ message: 'Los campos obligatorios son requeridos.' });
        }

        proyecto.nombre = nombre;
        proyecto.descripcion = descripcion;
        proyecto.estado = estado;
        proyecto.fecha_inicio = fecha_inicio;
        proyecto.fecha_fin = fecha_fin;
        proyecto.fecha_ult_actua = fecha_ult_actua;

        await proyecto.save();

        return res.status(200).json(proyecto);
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        return res.status(500).json({ message: 'Error al actualizar el proyecto.' });
    }
};

// Eliminar un proyecto
export const deleteProyecto = async (req, res) => {
    try {
        const { id } = req.params;
        const proyecto = await Proyecto.findByPk(id);

        if (!proyecto) {
            return res.status(404).json({ message: 'Proyecto no encontrado.' });
        }

        await proyecto.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        return res.status(500).json({ message: 'Error al eliminar el proyecto.' });
    }
};
