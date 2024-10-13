import TipoMarca from '../models/TipoMarca.js';

// Obtener todos los tipos de marca
export const getTipoMarcas = async (req, res) => {
    try {
        const tipoMarcas = await TipoMarca.findAll();
        return res.status(200).json(tipoMarcas);
    } catch (error) {
        console.error('Error al obtener los tipos de marca:', error);
        return res.status(500).json({ message: 'Error al obtener los tipos de marca.' });
    }
};

// Obtener un tipo de marca por ID
export const getTipoMarcaById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoMarca = await TipoMarca.findByPk(id);

        if (!tipoMarca) {
            return res.status(404).json({ message: 'Tipo de marca no encontrado.' });
        }

        return res.status(200).json(tipoMarca);
    } catch (error) {
        console.error('Error al obtener el tipo de marca:', error);
        return res.status(500).json({ message: 'Error al obtener el tipo de marca.' });
    }
};

// Crear un nuevo tipo de marca
export const createTipoMarca = async (req, res) => {
    try {
        const { nombre } = req.body;
        const nuevoTipoMarca = await TipoMarca.create({ nombre });
        return res.status(201).json(nuevoTipoMarca);
    } catch (error) {
        console.error('Error al crear el tipo de marca:', error);
        return res.status(500).json({ message: 'Error al crear el tipo de marca.' });
    }
};

// Actualizar un tipo de marca
export const updateTipoMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        const tipoMarca = await TipoMarca.findByPk(id);
        if (!tipoMarca) {
            return res.status(404).json({ message: 'Tipo de marca no encontrado.' });
        }

        tipoMarca.nombre = nombre;
        await tipoMarca.save();

        return res.status(200).json(tipoMarca);
    } catch (error) {
        console.error('Error al actualizar el tipo de marca:', error);
        return res.status(500).json({ message: 'Error al actualizar el tipo de marca.' });
    }
};

// Eliminar un tipo de marca
export const deleteTipoMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoMarca = await TipoMarca.findByPk(id);

        if (!tipoMarca) {
            return res.status(404).json({ message: 'Tipo de marca no encontrado.' });
        }

        await tipoMarca.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el tipo de marca:', error);
        return res.status(500).json({ message: 'Error al eliminar el tipo de marca.' });
    }
};
