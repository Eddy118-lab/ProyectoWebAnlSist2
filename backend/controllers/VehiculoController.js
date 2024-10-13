import Vehiculo from '../models/Vehiculo.js';
import TipoMarca from '../models/TipoMarca.js';

// Obtener todos los vehículos
export const getVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.findAll({
            include: {
                model: TipoMarca,
                as: 'tipoMarca',
                attributes: ['id', 'nombre'] // Selecciona solo los campos necesarios
            }
        });
        return res.status(200).json(vehiculos);
    } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        return res.status(500).json({ message: 'Error al obtener los vehículos.' });
    }
};

// Obtener un vehículo por ID
export const getVehiculoById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculo = await Vehiculo.findByPk(id, {
            include: {
                model: TipoMarca,
                as: 'tipoMarca',
                attributes: ['id', 'nombre']
            }
        });

        if (!vehiculo) {
            return res.status(404).json({ message: 'Vehículo no encontrado.' });
        }

        return res.status(200).json(vehiculo);
    } catch (error) {
        console.error('Error al obtener el vehículo:', error);
        return res.status(500).json({ message: 'Error al obtener el vehículo.' });
    }
};

// Crear un nuevo vehículo
export const createVehiculo = async (req, res) => {
    try {
        const { placa, modelo, estado, tipo_marca_id } = req.body;
        const nuevoVehiculo = await Vehiculo.create({ placa, modelo, estado, tipo_marca_id });
        return res.status(201).json(nuevoVehiculo);
    } catch (error) {
        console.error('Error al crear el vehículo:', error);
        return res.status(500).json({ message: 'Error al crear el vehículo.' });
    }
};

// Actualizar un vehículo
export const updateVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const { placa, modelo, estado, tipo_marca_id } = req.body;

        const vehiculo = await Vehiculo.findByPk(id);
        if (!vehiculo) {
            return res.status(404).json({ message: 'Vehículo no encontrado.' });
        }

        // Actualiza los campos del vehículo
        vehiculo.placa = placa;
        vehiculo.modelo = modelo;
        vehiculo.estado = estado;
        vehiculo.tipo_marca_id = tipo_marca_id;
        
        await vehiculo.save();

        return res.status(200).json(vehiculo);
    } catch (error) {
        console.error('Error al actualizar el vehículo:', error);
        return res.status(500).json({ message: 'Error al actualizar el vehículo.' });
    }
};

// Eliminar un vehículo
export const deleteVehiculo = async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculo = await Vehiculo.findByPk(id);

        if (!vehiculo) {
            return res.status(404).json({ message: 'Vehículo no encontrado.' });
        }

        await vehiculo.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        return res.status(500).json({ message: 'Error al eliminar el vehículo.' });
    }
};
