import Conductor from '../models/Conductor.js';
import { unlink } from 'fs'; // Para eliminar archivos si es necesario
import path from 'path';

// Obtener todos los conductores
export const getConductores = async (req, res) => {
    try {
        const conductores = await Conductor.findAll();
        return res.status(200).json(conductores);
    } catch (error) {
        console.error('Error al obtener los conductores:', error);
        return res.status(500).json({ message: 'Error al obtener los conductores.' });
    }
};

// Obtener un conductor por ID
export const getConductorById = async (req, res) => {
    try {
        const { id } = req.params;
        const conductor = await Conductor.findByPk(id);
        
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado.' });
        }

        return res.status(200).json(conductor);
    } catch (error) {
        console.error('Error al obtener el conductor:', error);
        return res.status(500).json({ message: 'Error al obtener el conductor.' });
    }
};

// Crear un nuevo conductor
export const createConductor = async (req, res) => {
    try {
        const { 
            primer_nom, 
            segundo_nombre, 
            primer_apell, 
            segundo_apell, 
            no_licencia, 
            telefono, 
            email, 
            fecha_contratacion 
        } = req.body;

        // Manejo de imágenes
        const front_imagen_url = req.files.front_imagen_url ? req.files.front_imagen_url[0].filename : null;
        const tras_imagen_url = req.files.tras_imagen_url ? req.files.tras_imagen_url[0].filename : null;

        const nuevoConductor = await Conductor.create({
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
        return res.status(201).json(nuevoConductor);
    } catch (error) {
        console.error('Error al crear el conductor:', error);
        return res.status(500).json({ message: 'Error al crear el conductor.' });
    }
};

// Actualizar un conductor
export const updateConductor = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            primer_nom, 
            segundo_nombre, 
            primer_apell, 
            segundo_apell, 
            no_licencia, 
            telefono, 
            email, 
            fecha_contratacion 
        } = req.body;

        const conductor = await Conductor.findByPk(id);
        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado.' });
        }

        // Manejo de imágenes
        const front_imagen_url = req.files.front_imagen_url ? req.files.front_imagen_url[0].filename : conductor.front_imagen_url;
        const tras_imagen_url = req.files.tras_imagen_url ? req.files.tras_imagen_url[0].filename : conductor.tras_imagen_url;

        // Si se están actualizando las imágenes, podrías eliminar las antiguas si es necesario
        if (req.files.front_imagen_url) {
            const oldFrontImagePath = path.join(__dirname, '../uploads/', conductor.front_imagen_url);
            unlink(oldFrontImagePath, (err) => {
                if (err) console.error('Error al eliminar la imagen frontal antigua:', err);
            });
        }
        if (req.files.tras_imagen_url) {
            const oldTrasImagePath = path.join(__dirname, '../uploads/', conductor.tras_imagen_url);
            unlink(oldTrasImagePath, (err) => {
                if (err) console.error('Error al eliminar la imagen trasera antigua:', err);
            });
        }

        // Actualiza los campos del conductor
        conductor.primer_nom = primer_nom;
        conductor.segundo_nombre = segundo_nombre;
        conductor.primer_apell = primer_apell;
        conductor.segundo_apell = segundo_apell;
        conductor.no_licencia = no_licencia;
        conductor.telefono = telefono;
        conductor.email = email;
        conductor.fecha_contratacion = fecha_contratacion;
        conductor.front_imagen_url = front_imagen_url;
        conductor.tras_imagen_url = tras_imagen_url;

        await conductor.save();

        return res.status(200).json(conductor);
    } catch (error) {
        console.error('Error al actualizar el conductor:', error);
        return res.status(500).json({ message: 'Error al actualizar el conductor.' });
    }
};

// Eliminar un conductor
export const deleteConductor = async (req, res) => {
    try {
        const { id } = req.params;
        const conductor = await Conductor.findByPk(id);

        if (!conductor) {
            return res.status(404).json({ message: 'Conductor no encontrado.' });
        }

        // Eliminar las imágenes del servidor
        if (conductor.front_imagen_url) {
            const frontImagePath = path.join(__dirname, '../uploads/', conductor.front_imagen_url);
            unlink(frontImagePath, (err) => {
                if (err) console.error('Error al eliminar la imagen frontal:', err);
            });
        }
        if (conductor.tras_imagen_url) {
            const trasImagePath = path.join(__dirname, '../uploads', conductor.tras_imagen_url);
            unlink(trasImagePath, (err) => {
                if (err) console.error('Error al eliminar la imagen trasera:', err);
            });
        }

        await conductor.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el conductor:', error);
        return res.status(500).json({ message: 'Error al eliminar el conductor.' });
    }
};
