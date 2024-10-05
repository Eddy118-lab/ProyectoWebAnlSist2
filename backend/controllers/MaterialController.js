import Material from '../models/Material.js';
import { unlink } from 'fs';
import path from 'path';
import multer from 'multer';
import Dimension from '../models/Dimension.js';
import Peso from '../models/Peso.js';
import TipoMaterial from '../models/TipoMaterial.js';
import Proveedor from '../models/Proveedor.js';

// Configuración de multer para subir imágenes a 'uploadsMaterial'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadsMaterial'); // Directorio de almacenamiento
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Guarda con nombre único
    }
});

// Configuración de multer con límite de 10MB por archivo
const uploadMaterial = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
});

// Obtener todos los materiales
export const getMateriales = async (req, res) => {
    try {
        const materiales = await Material.findAll({
            include: [
                { model: Dimension, as: 'dimension' },
                { model: Peso, as: 'peso' },
                { model: TipoMaterial, as: 'tipoMaterial' },
                { model: Proveedor, as: 'proveedor' }
            ]
        });
        return res.status(200).json(materiales);
    } catch (error) {
        console.error('Error al obtener los materiales:', error);
        return res.status(500).json({ message: 'Error al obtener los materiales.' });
    }
};

// Obtener un material por ID
export const getMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findByPk(id, {
            include: [
                { model: Dimension, as: 'dimension' },
                { model: Peso, as: 'peso' },
                { model: TipoMaterial, as: 'tipoMaterial' },
                { model: Proveedor, as: 'proveedor' }
            ]
        });

        if (!material) {
            return res.status(404).json({ message: 'Material no encontrado.' });
        }

        return res.status(200).json(material);
    } catch (error) {
        console.error('Error al obtener el material:', error);
        return res.status(500).json({ message: 'Error al obtener el material.' });
    }
};

export const createMaterial = async (req, res) => {
    try {
        const { nombre, descripcion, dimension_id, peso_id, tipo_material_id, proveedor_id } = req.body;

        // Verificar que todos los campos necesarios estén presentes
        if (!nombre || !dimension_id || !peso_id || !tipo_material_id || !proveedor_id) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Manejo de la imagen
        const imagen_url = req.file ? req.file.filename : null;

        const nuevoMaterial = await Material.create({
            nombre,
            descripcion,
            imagen_url,
            dimension_id,
            peso_id,
            tipo_material_id,
            proveedor_id,
        });

        return res.status(201).json(nuevoMaterial);
    } catch (error) {
        console.error('Error al crear el material:', error);
        return res.status(500).json({ message: 'Error al crear el material.' });
    }
};

// Actualizar un material
export const updateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, dimension_id, peso_id, tipo_material_id, proveedor_id } = req.body;

        const material = await Material.findByPk(id);
        if (!material) {
            return res.status(404).json({ message: 'Material no encontrado.' });
        }

        // Manejo de imagen
        const imagen_url = req.file ? req.file.filename : material.imagen_url;

        // Si se está actualizando la imagen, eliminar la antigua si es necesario
        if (req.file && material.imagen_url) {
            const oldImagePath = path.join('uploadsMaterial', material.imagen_url);
            unlink(oldImagePath, (err) => {
                if (err) console.error('Error al eliminar la imagen antigua:', err);
            });
        }

        // Actualiza los campos del material
        material.nombre = nombre;
        material.descripcion = descripcion;
        material.dimension_id = dimension_id;
        material.peso_id = peso_id;
        material.tipo_material_id = tipo_material_id;
        material.proveedor_id = proveedor_id;
        material.imagen_url = imagen_url;

        await material.save();

        return res.status(200).json(material);
    } catch (error) {
        console.error('Error al actualizar el material:', error);
        return res.status(500).json({ message: 'Error al actualizar el material.' });
    }
};

// Eliminar un material
export const deleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const material = await Material.findByPk(id);

        if (!material) {
            return res.status(404).json({ message: 'Material no encontrado.' });
        }

        // Eliminar la imagen del servidor
        if (material.imagen_url) {
            const imagePath = path.join('uploadsMaterial', material.imagen_url);
            unlink(imagePath, (err) => {
                if (err) console.error('Error al eliminar la imagen:', err);
            });
        }

        await material.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el material:', error);
        return res.status(500).json({ message: 'Error al eliminar el material.' });
    }
};
