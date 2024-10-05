import TipoMaterial from '../models/TipoMaterial.js'; // Ajusta la ruta según sea necesario

// Obtener todos los tipos de materiales
export const getTipoMateriales = async (req, res) => {
    try {
        const tiposMateriales = await TipoMaterial.findAll();
        return res.status(200).json(tiposMateriales);
    } catch (error) {
        console.error('Error al obtener los tipos de materiales:', error);
        return res.status(500).json({ message: 'Error al obtener los tipos de materiales.' });
    }
};

// Obtener un tipo de material por ID
export const getTipoMaterialById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoMaterial = await TipoMaterial.findByPk(id);
        
        if (!tipoMaterial) {
            return res.status(404).json({ message: 'Tipo de material no encontrado.' });
        }

        return res.status(200).json(tipoMaterial);
    } catch (error) {
        console.error('Error al obtener el tipo de material:', error);
        return res.status(500).json({ message: 'Error al obtener el tipo de material.' });
    }
};

// Crear un nuevo tipo de material
export const createTipoMaterial = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const nuevoTipoMaterial = await TipoMaterial.create({ descripcion });
        return res.status(201).json(nuevoTipoMaterial);
    } catch (error) {
        console.error('Error al crear el tipo de material:', error);
        return res.status(500).json({ message: 'Error al crear el tipo de material.' });
    }
};

// Actualizar un tipo de material
export const updateTipoMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;
        
        const tipoMaterial = await TipoMaterial.findByPk(id);
        if (!tipoMaterial) {
            return res.status(404).json({ message: 'Tipo de material no encontrado.' });
        }

        tipoMaterial.descripcion = descripcion;
        await tipoMaterial.save();

        return res.status(200).json(tipoMaterial);
    } catch (error) {
        console.error('Error al actualizar el tipo de material:', error);
        return res.status(500).json({ message: 'Error al actualizar el tipo de material.' });
    }
};

// Eliminar un tipo de material
export const deleteTipoMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoMaterial = await TipoMaterial.findByPk(id);
        
        if (!tipoMaterial) {
            return res.status(404).json({ message: 'Tipo de material no encontrado.' });
        }

        await tipoMaterial.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el tipo de material:', error);
        return res.status(500).json({ message: 'Error al eliminar el tipo de material.' });
    }
};
