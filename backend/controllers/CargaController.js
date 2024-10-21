import Carga from '../models/Carga.js';
import Asignacion from '../models/Asignacion.js';
import Inventario from '../models/Inventario.js';

// Obtener todas las cargas
export const getCargas = async (req, res) => {
    try {
        const cargas = await Carga.findAll({
            include: [
                {
                    model: Asignacion,
                    as: 'asignacion',
                    attributes: ['id', 'fecha_asignacion', 'conductor_id', 'vehiculo_id', 'ruta_id', 'tipo_estado_id']
                },
                {
                    model: Inventario,
                    as: 'inventario',
                    attributes: ['id', 'precio_unitario', 'cantidad', 'fecha_ingreso', 'stock_min', 'stock_max', 'material_id']
                }
            ]
        });
        return res.status(200).json(cargas);
    } catch (error) {
        console.error('Error al obtener las cargas:', error);
        return res.status(500).json({ message: 'Error al obtener las cargas.' });
    }
};

// Obtener una carga por ID
export const getCargaById = async (req, res) => {
    try {
        const { id } = req.params;
        const carga = await Carga.findByPk(id, {
            include: [
                {
                    model: Asignacion,
                    as: 'asignacion',
                    attributes: ['id', 'fecha_asignacion', 'conductor_id', 'vehiculo_id', 'ruta_id', 'tipo_estado_id']
                },
                {
                    model: Inventario,
                    as: 'inventario',
                    attributes: ['id', 'precio_unitario', 'cantidad', 'fecha_ingreso', 'stock_min', 'stock_max', 'material_id']
                }
            ]
        });

        if (!carga) {
            return res.status(404).json({ message: 'Carga no encontrada.' });
        }

        return res.status(200).json(carga);
    } catch (error) {
        console.error('Error al obtener la carga:', error);
        return res.status(500).json({ message: 'Error al obtener la carga.' });
    }
};

// Crear una nueva carga
export const createCarga = async (req, res) => {
    try {
        const { nombre, descripcion, precio_unitario, asignacion_id, inventario_id } = req.body;

        // Validaciones simples
        if (!nombre || !descripcion || !precio_unitario || !asignacion_id || !inventario_id) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        const nuevaCarga = await Carga.create({
            nombre,
            descripcion,
            precio_unitario,
            asignacion_id,
            inventario_id
        });
        return res.status(201).json(nuevaCarga);
    } catch (error) {
        console.error('Error al crear la carga:', error);
        return res.status(500).json({ message: 'Error al crear la carga.' });
    }
};

// Actualizar una carga
export const updateCarga = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio_unitario, asignacion_id, inventario_id } = req.body;

        const carga = await Carga.findByPk(id);
        if (!carga) {
            return res.status(404).json({ message: 'Carga no encontrada.' });
        }

        // Validaciones simples
        if (!nombre || !descripcion || !precio_unitario || !asignacion_id || !inventario_id) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        // Actualiza los campos de la carga
        carga.nombre = nombre;
        carga.descripcion = descripcion;
        carga.precio_unitario = precio_unitario;
        carga.asignacion_id = asignacion_id;
        carga.inventario_id = inventario_id;

        await carga.save();

        return res.status(200).json(carga);
    } catch (error) {
        console.error('Error al actualizar la carga:', error);
        return res.status(500).json({ message: 'Error al actualizar la carga.' });
    }
};

// Eliminar una carga
export const deleteCarga = async (req, res) => {
    try {
        const { id } = req.params;
        const carga = await Carga.findByPk(id);

        if (!carga) {
            return res.status(404).json({ message: 'Carga no encontrada.' });
        }

        await carga.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar la carga:', error);
        return res.status(500).json({ message: 'Error al eliminar la carga.' });
    }
};
