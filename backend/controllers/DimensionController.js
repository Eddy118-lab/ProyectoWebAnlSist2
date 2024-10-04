import Dimension from '../models/Dimension.js';

// Obtener todas las dimensiones
export const getDimensiones = async (req, res) => {
    try {
        const dimensiones = await Dimension.findAll();
        return res.status(200).json(dimensiones);
    } catch (error) {
        console.error('Error al obtener las dimensiones:', error);
        return res.status(500).json({ message: 'Error al obtener las dimensiones.' });
    }
};

// Obtener una dimensión por ID
export const getDimensionById = async (req, res) => {
    try {
        const { id } = req.params;
        const dimension = await Dimension.findByPk(id);
        
        if (!dimension) {
            return res.status(404).json({ message: 'Dimensión no encontrada.' });
        }

        return res.status(200).json(dimension);
    } catch (error) {
        console.error('Error al obtener la dimensión:', error);
        return res.status(500).json({ message: 'Error al obtener la dimensión.' });
    }
};

// Crear una nueva dimensión
export const createDimension = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const nuevaDimension = await Dimension.create({ descripcion });
        return res.status(201).json(nuevaDimension);
    } catch (error) {
        console.error('Error al crear la dimensión:', error);
        return res.status(500).json({ message: 'Error al crear la dimensión.' });
    }
};

// Actualizar una dimensión
export const updateDimension = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;
        
        const dimension = await Dimension.findByPk(id);
        if (!dimension) {
            return res.status(404).json({ message: 'Dimensión no encontrada.' });
        }

        dimension.descripcion = descripcion;
        await dimension.save();

        return res.status(200).json(dimension);
    } catch (error) {
        console.error('Error al actualizar la dimensión:', error);
        return res.status(500).json({ message: 'Error al actualizar la dimensión.' });
    }
};

// Eliminar una dimensión
export const deleteDimension = async (req, res) => {
    try {
        const { id } = req.params;
        const dimension = await Dimension.findByPk(id);
        
        if (!dimension) {
            return res.status(404).json({ message: 'Dimensión no encontrada.' });
        }

        await dimension.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar la dimensión:', error);
        return res.status(500).json({ message: 'Error al eliminar la dimensión.' });
    }
};
