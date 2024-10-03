import Proveedor from '../models/Proveedor.js'; // Ajusta la ruta según sea necesario
import TipoProveedor from '../models/TipoProveedor.js'; // Ajusta la ruta según sea necesario

// Obtener todos los proveedores
export const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll({
            include: {
                model: TipoProveedor,
                as: 'tipoProveedor',
            },
        });
        return res.status(200).json(proveedores);
    } catch (error) {
        console.error('Error al obtener los proveedores:', error);
        return res.status(500).json({ message: 'Error al obtener los proveedores.' });
    }
};

// Obtener un proveedor por ID
export const getProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findByPk(id, {
            include: {
                model: TipoProveedor,
                as: 'tipoProveedor',
            },
        });

        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado.' });
        }

        return res.status(200).json(proveedor);
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        return res.status(500).json({ message: 'Error al obtener el proveedor.' });
    }
};

// Crear un nuevo proveedor
export const createProveedor = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email, nit, tipo_proveedor_id } = req.body;
        const nuevoProveedor = await Proveedor.create({ 
            nombre, 
            direccion, 
            telefono, 
            email, 
            nit, 
            tipo_proveedor_id 
        });
        return res.status(201).json(nuevoProveedor);
    } catch (error) {
        console.error('Error al crear el proveedor:', error);
        return res.status(500).json({ message: 'Error al crear el proveedor.' });
    }
};

// Actualizar un proveedor
export const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, telefono, email, nit, tipo_proveedor_id } = req.body;

        const proveedor = await Proveedor.findByPk(id);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado.' });
        }

        proveedor.nombre = nombre;
        proveedor.direccion = direccion;
        proveedor.telefono = telefono;
        proveedor.email = email;
        proveedor.nit = nit;
        proveedor.tipo_proveedor_id = tipo_proveedor_id;
        await proveedor.save();

        return res.status(200).json(proveedor);
    } catch (error) {
        console.error('Error al actualizar el proveedor:', error);
        return res.status(500).json({ message: 'Error al actualizar el proveedor.' });
    }
};

// Eliminar un proveedor
export const deleteProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findByPk(id);

        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado.' });
        }

        await proveedor.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el proveedor:', error);
        return res.status(500).json({ message: 'Error al eliminar el proveedor.' });
    }
};
