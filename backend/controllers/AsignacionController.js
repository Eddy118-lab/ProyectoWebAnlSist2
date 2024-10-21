import Asignacion from '../models/Asignacion.js';
import Conductor from '../models/Conductor.js';
import Vehiculo from '../models/Vehiculo.js';
import Ruta from '../models/Ruta.js';
import TipoEstado from '../models/TipoEstado.js';

// Obtener todas las asignaciones
// Obtener todas las asignaciones, con opción de filtrar por fecha
export const getAsignaciones = async (req, res) => {
    try {
        // Verificar si se pasó el parámetro 'fecha_asignacion' en la consulta
        const { fecha_asignacion } = req.query;
        
        // Crear un objeto de filtro
        let whereClause = {};
        
        if (fecha_asignacion) {
            // Si existe 'fecha_asignacion' en la consulta, se añade al filtro
            whereClause.fecha_asignacion = fecha_asignacion;
        }

        const asignaciones = await Asignacion.findAll({
            where: whereClause,  // Aplicar el filtro de fecha si existe
            include: [
                {
                    model: Conductor,
                    as: 'conductor',
                    attributes: ['id', 'primer_nom', 'primer_apell']
                },
                {
                    model: Vehiculo,
                    as: 'vehiculo',
                    attributes: ['id', 'placa', 'modelo']
                },
                {
                    model: Ruta,
                    as: 'ruta',
                    attributes: ['id', 'nombre', 'origen', 'destino']
                },
                {
                    model: TipoEstado,
                    as: 'tipoEstado',
                    attributes: ['id', 'descripcion']
                }
            ]
        });

        return res.status(200).json(asignaciones);
    } catch (error) {
        console.error('Error al obtener las asignaciones:', error);
        return res.status(500).json({ message: 'Error al obtener las asignaciones.' });
    }
};


// Obtener una asignación por ID
export const getAsignacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const asignacion = await Asignacion.findByPk(id, {
            include: [
                {
                    model: Conductor,
                    as: 'conductor',
                    attributes: ['id', 'primer_nom', 'primer_apell']
                },
                {
                    model: Vehiculo,
                    as: 'vehiculo',
                    attributes: ['id', 'placa', 'modelo']
                },
                {
                    model: Ruta,
                    as: 'ruta',
                    attributes: ['id', 'nombre', 'origen', 'destino']
                },
                {
                    model: TipoEstado,
                    as: 'tipoEstado',
                    attributes: ['id', 'descripcion']
                }
            ]
        });

        if (!asignacion) {
            return res.status(404).json({ message: 'Asignación no encontrada.' });
        }

        return res.status(200).json(asignacion);
    } catch (error) {
        console.error('Error al obtener la asignación:', error);
        return res.status(500).json({ message: 'Error al obtener la asignación.' });
    }
};

// Crear una nueva asignación
export const createAsignacion = async (req, res) => {
    try {
        const { fecha_asignacion, conductor_id, vehiculo_id, ruta_id, tipo_estado_id } = req.body;
        const nuevaAsignacion = await Asignacion.create({
            fecha_asignacion,
            conductor_id,
            vehiculo_id,
            ruta_id,
            tipo_estado_id
        });
        return res.status(201).json(nuevaAsignacion);
    } catch (error) {
        console.error('Error al crear la asignación:', error);
        return res.status(500).json({ message: 'Error al crear la asignación.' });
    }
};

// Actualizar una asignación
export const updateAsignacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha_asignacion, conductor_id, vehiculo_id, ruta_id, tipo_estado_id } = req.body;

        const asignacion = await Asignacion.findByPk(id);
        if (!asignacion) {
            return res.status(404).json({ message: 'Asignación no encontrada.' });
        }

        // Actualiza los campos de la asignación
        asignacion.fecha_asignacion = fecha_asignacion;
        asignacion.conductor_id = conductor_id;
        asignacion.vehiculo_id = vehiculo_id;
        asignacion.ruta_id = ruta_id;
        asignacion.tipo_estado_id = tipo_estado_id;

        await asignacion.save();

        return res.status(200).json(asignacion);
    } catch (error) {
        console.error('Error al actualizar la asignación:', error);
        return res.status(500).json({ message: 'Error al actualizar la asignación.' });
    }
};

// Eliminar una asignación
export const deleteAsignacion = async (req, res) => {
    try {
        const { id } = req.params;
        const asignacion = await Asignacion.findByPk(id);

        if (!asignacion) {
            return res.status(404).json({ message: 'Asignación no encontrada.' });
        }

        await asignacion.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar la asignación:', error);
        return res.status(500).json({ message: 'Error al eliminar la asignación.' });
    }
};
