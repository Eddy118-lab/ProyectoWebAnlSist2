import Ruta from '../models/Ruta.js';

// Obtener todas las rutas
export const getRutas = async (req, res) => {
    try {
        const rutas = await Ruta.findAll();
        return res.status(200).json(rutas);
    } catch (error) {
        console.error('Error al obtener las rutas:', error);
        return res.status(500).json({ message: 'Error al obtener las rutas.' });
    }
};

// Obtener una ruta por ID
export const getRutaById = async (req, res) => {
    try {
        const { id } = req.params;
        const ruta = await Ruta.findByPk(id);

        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada.' });
        }

        return res.status(200).json(ruta);
    } catch (error) {
        console.error('Error al obtener la ruta:', error);
        return res.status(500).json({ message: 'Error al obtener la ruta.' });
    }
};

// Crear una nueva ruta
export const createRuta = async (req, res) => {
    try {
        const { nombre, descripcion, origen, destino } = req.body;
        const nuevaRuta = await Ruta.create({ nombre, descripcion, origen, destino });
        return res.status(201).json(nuevaRuta);
    } catch (error) {
        console.error('Error al crear la ruta:', error);
        return res.status(500).json({ message: 'Error al crear la ruta.' });
    }
};

// Actualizar una ruta
export const updateRuta = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, origen, destino } = req.body;

        const ruta = await Ruta.findByPk(id);
        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada.' });
        }

        // Actualiza los campos de la ruta
        ruta.nombre = nombre;
        ruta.descripcion = descripcion;
        ruta.origen = origen;
        ruta.destino = destino;
        
        await ruta.save();

        return res.status(200).json(ruta);
    } catch (error) {
        console.error('Error al actualizar la ruta:', error);
        return res.status(500).json({ message: 'Error al actualizar la ruta.' });
    }
};

// Eliminar una ruta
export const deleteRuta = async (req, res) => {
    try {
        const { id } = req.params;
        const ruta = await Ruta.findByPk(id);

        if (!ruta) {
            return res.status(404).json({ message: 'Ruta no encontrada.' });
        }

        await ruta.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar la ruta:', error);
        return res.status(500).json({ message: 'Error al eliminar la ruta.' });
    }
};
