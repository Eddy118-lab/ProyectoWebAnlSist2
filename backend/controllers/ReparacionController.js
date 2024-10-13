import Reparacion from '../models/Reparacion.js';
import Vehiculo from '../models/Vehiculo.js';

// Obtener todas las reparaciones
export const getReparaciones = async (req, res) => {
    try {
        const reparaciones = await Reparacion.findAll({
            include: {
                model: Vehiculo,
                as: 'vehiculo',
                attributes: ['id', 'placa'] // Selecciona solo los campos necesarios
            }
        });
        return res.status(200).json(reparaciones);
    } catch (error) {
        console.error('Error al obtener las reparaciones:', error);
        return res.status(500).json({ message: 'Error al obtener las reparaciones.' });
    }
};

// Obtener una reparación por ID
export const getReparacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const reparacion = await Reparacion.findByPk(id, {
            include: {
                model: Vehiculo,
                as: 'vehiculo',
                attributes: ['id', 'placa']
            }
        });

        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada.' });
        }

        return res.status(200).json(reparacion);
    } catch (error) {
        console.error('Error al obtener la reparación:', error);
        return res.status(500).json({ message: 'Error al obtener la reparación.' });
    }
};

// Crear una nueva reparación
export const createReparacion = async (req, res) => {
    try {
        const { fecha, descripcion, costo, vehiculo_id } = req.body;
        const nuevaReparacion = await Reparacion.create({ fecha, descripcion, costo, vehiculo_id });
        return res.status(201).json(nuevaReparacion);
    } catch (error) {
        console.error('Error al crear la reparación:', error);
        return res.status(500).json({ message: 'Error al crear la reparación.' });
    }
};

// Actualizar una reparación
export const updateReparacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, descripcion, costo, vehiculo_id } = req.body;

        const reparacion = await Reparacion.findByPk(id);
        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada.' });
        }

        // Actualiza los campos de la reparación
        reparacion.fecha = fecha;
        reparacion.descripcion = descripcion;
        reparacion.costo = costo;
        reparacion.vehiculo_id = vehiculo_id;
        
        await reparacion.save();

        return res.status(200).json(reparacion);
    } catch (error) {
        console.error('Error al actualizar la reparación:', error);
        return res.status(500).json({ message: 'Error al actualizar la reparación.' });
    }
};

// Eliminar una reparación
export const deleteReparacion = async (req, res) => {
    try {
        const { id } = req.params;
        const reparacion = await Reparacion.findByPk(id);

        if (!reparacion) {
            return res.status(404).json({ message: 'Reparación no encontrada.' });
        }

        await reparacion.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar la reparación:', error);
        return res.status(500).json({ message: 'Error al eliminar la reparación.' });
    }
};
