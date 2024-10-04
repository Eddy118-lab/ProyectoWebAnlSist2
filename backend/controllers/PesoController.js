import Peso from '../models/Peso.js'; // Ajusta la ruta según sea necesario

// Obtener todos los pesos
export const getPesos = async (req, res) => {
    try {
        const pesos = await Peso.findAll();
        return res.status(200).json(pesos);
    } catch (error) {
        console.error('Error al obtener los pesos:', error);
        return res.status(500).json({ message: 'Error al obtener los pesos.' });
    }
};

// Obtener un peso por ID
export const getPesoById = async (req, res) => {
    try {
        const { id } = req.params;
        const peso = await Peso.findByPk(id);
        
        if (!peso) {
            return res.status(404).json({ message: 'Peso no encontrado.' });
        }

        return res.status(200).json(peso);
    } catch (error) {
        console.error('Error al obtener el peso:', error);
        return res.status(500).json({ message: 'Error al obtener el peso.' });
    }
};

// Crear un nuevo peso
export const createPeso = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const nuevoPeso = await Peso.create({ descripcion });
        return res.status(201).json(nuevoPeso);
    } catch (error) {
        console.error('Error al crear el peso:', error);
        return res.status(500).json({ message: 'Error al crear el peso.' });
    }
};

// Actualizar un peso
export const updatePeso = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;
        
        const peso = await Peso.findByPk(id);
        if (!peso) {
            return res.status(404).json({ message: 'Peso no encontrado.' });
        }

        peso.descripcion = descripcion;
        await peso.save();

        return res.status(200).json(peso);
    } catch (error) {
        console.error('Error al actualizar el peso:', error);
        return res.status(500).json({ message: 'Error al actualizar el peso.' });
    }
};

// Eliminar un peso
export const deletePeso = async (req, res) => {
    try {
        const { id } = req.params;
        const peso = await Peso.findByPk(id);
        
        if (!peso) {
            return res.status(404).json({ message: 'Peso no encontrado.' });
        }

        await peso.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el peso:', error);
        return res.status(500).json({ message: 'Error al eliminar el peso.' });
    }
};
