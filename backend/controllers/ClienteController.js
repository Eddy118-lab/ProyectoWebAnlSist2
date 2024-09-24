import Cliente from '../models/Cliente.js'; 
import TipoCliente from '../models/TipoCliente.js'; 

// Obtener todos los clientes
export const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            include: {
                model: TipoCliente,
                as: 'tipoCliente', // Asegúrate de que este alias coincide con la definición de la relación en el modelo
                attributes: ['id', 'descripcion'] // Selecciona solo los campos necesarios
            }
        });
        return res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener los clientes:', error);
        return res.status(500).json({ message: 'Error al obtener los clientes.' });
    }
};

// Obtener un cliente por ID
export const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id, {
            include: {
                model: TipoCliente,
                as: 'tipoCliente',
                attributes: ['id', 'descripcion']
            }
        });

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        return res.status(200).json(cliente);
    } catch (error) {
        console.error('Error al obtener el cliente:', error);
        return res.status(500).json({ message: 'Error al obtener el cliente.' });
    }
};

// Crear un nuevo cliente
export const createCliente = async (req, res) => {
    try {
        const { nombre, direccion, telefono, email, nit, tipo_cliente_id } = req.body;
        const nuevoCliente = await Cliente.create({ nombre, direccion, telefono, email, nit, tipo_cliente_id });
        return res.status(201).json(nuevoCliente);
    } catch (error) {
        console.error('Error al crear el cliente:', error);
        return res.status(500).json({ message: 'Error al crear el cliente.' });
    }
};

// Actualizar un cliente
export const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, direccion, telefono, email, nit, tipo_cliente_id } = req.body;

        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        // Actualiza los campos del cliente
        cliente.nombre = nombre;
        cliente.direccion = direccion;
        cliente.telefono = telefono;
        cliente.email = email;
        cliente.nit = nit;
        cliente.tipo_cliente_id = tipo_cliente_id;
        
        await cliente.save();

        return res.status(200).json(cliente);
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        return res.status(500).json({ message: 'Error al actualizar el cliente.' });
    }
};

// Eliminar un cliente
export const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        await cliente.destroy();
        return res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        return res.status(500).json({ message: 'Error al eliminar el cliente.' });
    }
};
