import Conductor from '../models/Conductor.js'; // Importa el modelo Conductor
import path from 'path';
import fs from 'fs';

// Ruta para subir imágenes (ajusta según tu configuración)
const uploadPath = path.join(__dirname, '../uploads/conductores');

const ConductorController = {
    // Obtener todos los conductores
    async findAll(req, res) {
        try {
            const conductores = await Conductor.findAll();
            res.status(200).json(conductores);
        } catch (error) {
            console.error("Error al obtener conductores:", error);
            res.status(500).json({ message: 'Error al obtener conductores', error });
        }
    },

    // Obtener un conductor por ID
    async findById(req, res) {
        const { id } = req.params;
        try {
            const conductor = await Conductor.findByPk(id);
            if (!conductor) {
                return res.status(404).json({ message: 'Conductor no encontrado' });
            }
            res.status(200).json(conductor);
        } catch (error) {
            console.error("Error al obtener conductor:", error);
            res.status(500).json({ message: 'Error al obtener conductor', error });
        }
    },
    
// Crear un nuevo conductor
async create(req, res) {
    try {
        const { primer_nom, segundo_nombre, primer_apell, segundo_apell, no_licencia, telefono, email, fecha_contratacion } = req.body;

        // Verifica si se han subido imágenes
        const front_imagen_url = req.files.front_imagen_url ? req.files.front_imagen_url[0].filename : null;
        const tras_imagen_url = req.files.tras_imagen_url ? req.files.tras_imagen_url[0].filename : null;

        const newConductor = await Conductor.create({
            primer_nom,
            segundo_nombre,
            primer_apell,
            segundo_apell,
            no_licencia,
            telefono,
            email,
            fecha_contratacion,
            front_imagen_url,
            tras_imagen_url,
        });

        res.status(201).json(newConductor);
    } catch (error) {
        console.error("Error al crear conductor:", error);
        res.status(500).json({ message: 'Error al crear conductor', error });
    }
},

    // Actualizar un conductor
    async update(req, res) {
        const { id } = req.params;
        try {
            const conductor = await Conductor.findByPk(id);
            if (!conductor) {
                return res.status(404).json({ message: 'Conductor no encontrado' });
            }

            const { primer_nom, segundo_nombre, primer_apell, segundo_apell, no_licencia, telefono, email, fecha_contratacion } = req.body;

            // Verifica si se han subido nuevas imágenes
            const front_imagen_url = req.files.front_imagen_url ? req.files.front_imagen_url[0].filename : conductor.front_imagen_url;
            const tras_imagen_url = req.files.tras_imagen_url ? req.files.tras_imagen_url[0].filename : conductor.tras_imagen_url;

            await conductor.update({
                primer_nom,
                segundo_nombre,
                primer_apell,
                segundo_apell,
                no_licencia,
                telefono,
                email,
                fecha_contratacion,
                front_imagen_url,
                tras_imagen_url,
            });

            res.status(200).json(conductor);
        } catch (error) {
            console.error("Error al actualizar conductor:", error);
            res.status(500).json({ message: 'Error al actualizar conductor', error });
        }
    },

    // Eliminar un conductor
    async delete(req, res) {
        const { id } = req.params;
        try {
            const conductor = await Conductor.findByPk(id);
            if (!conductor) {
                return res.status(404).json({ message: 'Conductor no encontrado' });
            }

            await conductor.destroy();
            res.status(204).send(); // No content
        } catch (error) {
            console.error("Error al eliminar conductor:", error);
            res.status(500).json({ message: 'Error al eliminar conductor', error });
        }
    },
};

export default ConductorController;
