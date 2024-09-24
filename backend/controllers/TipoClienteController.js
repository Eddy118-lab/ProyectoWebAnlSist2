import TipoCliente from '../models/TipoCliente.js'; // Ajusta la ruta según sea necesario

// Obtener todos los tipos de clientes
export const getTipoClientes = async (req, res) => {
    try {
        const tiposClientes = await TipoCliente.findAll();
        return res.status(200).json(tiposClientes);
    } catch (error) {
        console.error('Error al obtener los tipos de clientes:', error);
        return res.status(500).json({ message: 'Error al obtener los tipos de clientes.' });
    }
};

// Obtener un tipo de cliente por ID
export const getTipoClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoCliente = await TipoCliente.findByPk(id);
        
        if (!tipoCliente) {
            return res.status(404).json({ message: 'Tipo de cliente no encontrado.' });
        }

        return res.status(200).json(tipoCliente);
    } catch (error) {
        console.error('Error al obtener el tipo de cliente:', error);
        return res.status(500).json({ message: 'Error al obtener el tipo de cliente.' });
    }
};

// Crear un nuevo tipo de cliente
export const createTipoCliente = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const nuevoTipoCliente = await TipoCliente.create({ descripcion });
        return res.status(201).json(nuevoTipoCliente);
    } catch (error) {
        console.error('Error al crear el tipo de cliente:', error);
        return res.status(500).json({ message: 'Error al crear el tipo de cliente.' });
    }
};

// Actualizar un tipo de cliente
export const updateTipoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;
        
        const tipoCliente = await TipoCliente.findByPk(id);
        if (!tipoCliente) {
            return res.status(404).json({ message: 'Tipo de cliente no encontrado.' });
        }

        tipoCliente.descripcion = descripcion;
        await tipoCliente.save();

        return res.status(200).json(tipoCliente);
    } catch (error) {
        console.error('Error al actualizar el tipo de cliente:', error);
        return res.status(500).json({ message: 'Error al actualizar el tipo de cliente.' });
    }
};

// Eliminar un tipo de cliente
export const deleteTipoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoCliente = await TipoCliente.findByPk(id);
        
        if (!tipoCliente) {
            return res.status(404).json({ message: 'Tipo de cliente no encontrado.' });
        }

        await tipoCliente.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el tipo de cliente:', error);
        return res.status(500).json({ message: 'Error al eliminar el tipo de cliente.' });
    }
};
