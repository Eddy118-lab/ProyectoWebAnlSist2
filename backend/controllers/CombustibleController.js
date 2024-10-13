import Combustible from '../models/Combustible.js';
import Vehiculo from '../models/Vehiculo.js';

// Obtener todos los registros de combustible
export const getCombustibles = async (req, res) => {
    try {
        const combustibles = await Combustible.findAll({
            include: {
                model: Vehiculo,
                as: 'vehiculo',
                attributes: ['id', 'placa'] // Selecciona solo los campos necesarios
            }
        });
        return res.status(200).json(combustibles);
    } catch (error) {
        console.error('Error al obtener los registros de combustible:', error);
        return res.status(500).json({ message: 'Error al obtener los registros de combustible.' });
    }
};

// Obtener un registro de combustible por ID
export const getCombustibleById = async (req, res) => {
    try {
        const { id } = req.params;
        const combustible = await Combustible.findByPk(id, {
            include: {
                model: Vehiculo,
                as: 'vehiculo',
                attributes: ['id', 'placa']
            }
        });

        if (!combustible) {
            return res.status(404).json({ message: 'Registro de combustible no encontrado.' });
        }

        return res.status(200).json(combustible);
    } catch (error) {
        console.error('Error al obtener el registro de combustible:', error);
        return res.status(500).json({ message: 'Error al obtener el registro de combustible.' });
    }
};

// Crear un nuevo registro de combustible
export const createCombustible = async (req, res) => {
    try {
        const { fecha, cantidad, costo, vehiculo_id } = req.body;
        const nuevoCombustible = await Combustible.create({ fecha, cantidad, costo, vehiculo_id });
        return res.status(201).json(nuevoCombustible);
    } catch (error) {
        console.error('Error al crear el registro de combustible:', error);
        return res.status(500).json({ message: 'Error al crear el registro de combustible.' });
    }
};

// Actualizar un registro de combustible
export const updateCombustible = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, cantidad, costo, vehiculo_id } = req.body;

        const combustible = await Combustible.findByPk(id);
        if (!combustible) {
            return res.status(404).json({ message: 'Registro de combustible no encontrado.' });
        }

        // Actualiza los campos del combustible
        combustible.fecha = fecha;
        combustible.cantidad = cantidad;
        combustible.costo = costo;
        combustible.vehiculo_id = vehiculo_id;
        
        await combustible.save();

        return res.status(200).json(combustible);
    } catch (error) {
        console.error('Error al actualizar el registro de combustible:', error);
        return res.status(500).json({ message: 'Error al actualizar el registro de combustible.' });
    }
};

// Eliminar un registro de combustible
export const deleteCombustible = async (req, res) => {
    try {
        const { id } = req.params;
        const combustible = await Combustible.findByPk(id);

        if (!combustible) {
            return res.status(404).json({ message: 'Registro de combustible no encontrado.' });
        }

        await combustible.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el registro de combustible:', error);
        return res.status(500).json({ message: 'Error al eliminar el registro de combustible.' });
    }
};
