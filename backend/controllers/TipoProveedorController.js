import TipoProveedor from '../models/TipoProveedor.js';

// Obtener todos los tipos de proveedores
export const getTipoProveedores = async (req, res) => {
    try {
        const tiposProveedores = await TipoProveedor.findAll();
        return res.status(200).json(tiposProveedores);
    } catch (error) {
        console.error('Error al obtener los tipos de proveedores:', error);
        return res.status(500).json({ message: 'Error al obtener los tipos de proveedores.' });
    }
};

// Obtener un tipo de proveedor por ID
export const getTipoProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoProveedor = await TipoProveedor.findByPk(id);
        
        if (!tipoProveedor) {
            return res.status(404).json({ message: 'Tipo de proveedor no encontrado.' });
        }

        return res.status(200).json(tipoProveedor);
    } catch (error) {
        console.error('Error al obtener el tipo de proveedor:', error);
        return res.status(500).json({ message: 'Error al obtener el tipo de proveedor.' });
    }
};

// Crear un nuevo tipo de proveedor
export const createTipoProveedor = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const nuevoTipoProveedor = await TipoProveedor.create({ descripcion });
        return res.status(201).json(nuevoTipoProveedor);
    } catch (error) {
        console.error('Error al crear el tipo de proveedor:', error);
        return res.status(500).json({ message: 'Error al crear el tipo de proveedor.' });
    }
};

// Actualizar un tipo de proveedor
export const updateTipoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;
        
        const tipoProveedor = await TipoProveedor.findByPk(id);
        if (!tipoProveedor) {
            return res.status(404).json({ message: 'Tipo de proveedor no encontrado.' });
        }

        tipoProveedor.descripcion = descripcion;
        await tipoProveedor.save();

        return res.status(200).json(tipoProveedor);
    } catch (error) {
        console.error('Error al actualizar el tipo de proveedor:', error);
        return res.status(500).json({ message: 'Error al actualizar el tipo de proveedor.' });
    }
};

// Eliminar un tipo de proveedor
export const deleteTipoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoProveedor = await TipoProveedor.findByPk(id);
        
        if (!tipoProveedor) {
            return res.status(404).json({ message: 'Tipo de proveedor no encontrado.' });
        }

        await tipoProveedor.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el tipo de proveedor:', error);
        return res.status(500).json({ message: 'Error al eliminar el tipo de proveedor.' });
    }
};
