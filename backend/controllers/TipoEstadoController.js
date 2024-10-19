import TipoEstado from '../models/TipoEstado.js';

// Obtener todos los tipos de estado
export const getTipoEstados = async (req, res) => {
    try {
        const tiposEstados = await TipoEstado.findAll();
        return res.status(200).json(tiposEstados);
    } catch (error) {
        console.error('Error al obtener los tipos de estado:', error);
        return res.status(500).json({ message: 'Error al obtener los tipos de estado.' });
    }
};

// Obtener un tipo de estado por ID
export const getTipoEstadoById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoEstado = await TipoEstado.findByPk(id);
        
        if (!tipoEstado) {
            return res.status(404).json({ message: 'Tipo de estado no encontrado.' });
        }

        return res.status(200).json(tipoEstado);
    } catch (error) {
        console.error('Error al obtener el tipo de estado:', error);
        return res.status(500).json({ message: 'Error al obtener el tipo de estado.' });
    }
};

// Crear un nuevo tipo de estado
export const createTipoEstado = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const nuevoTipoEstado = await TipoEstado.create({ descripcion });
        return res.status(201).json(nuevoTipoEstado);
    } catch (error) {
        console.error('Error al crear el tipo de estado:', error);
        return res.status(500).json({ message: 'Error al crear el tipo de estado.' });
    }
};

// Actualizar un tipo de estado
export const updateTipoEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;
        
        const tipoEstado = await TipoEstado.findByPk(id);
        if (!tipoEstado) {
            return res.status(404).json({ message: 'Tipo de estado no encontrado.' });
        }

        tipoEstado.descripcion = descripcion;
        await tipoEstado.save();

        return res.status(200).json(tipoEstado);
    } catch (error) {
        console.error('Error al actualizar el tipo de estado:', error);
        return res.status(500).json({ message: 'Error al actualizar el tipo de estado.' });
    }
};

// Eliminar un tipo de estado
export const deleteTipoEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoEstado = await TipoEstado.findByPk(id);
        
        if (!tipoEstado) {
            return res.status(404).json({ message: 'Tipo de estado no encontrado.' });
        }

        await tipoEstado.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el tipo de estado:', error);
        return res.status(500).json({ message: 'Error al eliminar el tipo de estado.' });
    }
};
