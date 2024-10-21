import FacturaCliente from '../models/FacturaCliente.js';
import Cliente from '../models/Cliente.js'; // Asegúrate de que este modelo esté disponible

// Get all Facturas Clientes
export const getFacturasClientes = async (req, res) => {
    try {
        const facturasClientes = await FacturaCliente.findAll({
            include: [{ model: Cliente, as: 'cliente' }] // Usa el alias definido aquí
        });
        res.json(facturasClientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Factura Cliente by ID
export const getFacturaClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const facturaCliente = await FacturaCliente.findOne({
            where: { id },
            include: [{ model: Cliente, as: 'cliente' }] // Usa el alias definido aquí
        });

        if (!facturaCliente) return res.status(404).json({ message: 'Factura de Cliente no encontrada' });

        res.json(facturaCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Factura Cliente
export const createFacturaCliente = async (req, res) => {
    try {
        const { fecha, monto, cliente_id } = req.body;

        const newFacturaCliente = await FacturaCliente.create({
            fecha,
            monto,
            cliente_id
        });

        res.status(201).json(newFacturaCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing Factura Cliente
export const updateFacturaCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, monto, cliente_id } = req.body;

        const facturaCliente = await FacturaCliente.findByPk(id);
        if (!facturaCliente) return res.status(404).json({ message: 'Factura de Cliente no encontrada' });

        facturaCliente.fecha = fecha;
        facturaCliente.monto = monto;
        facturaCliente.cliente_id = cliente_id;

        await facturaCliente.save();
        res.json(facturaCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Factura Cliente
export const deleteFacturaCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const facturaCliente = await FacturaCliente.findByPk(id);
        if (!facturaCliente) return res.status(404).json({ message: 'Factura de Cliente no encontrada' });

        await facturaCliente.destroy();
        res.json({ message: 'Factura de Cliente eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
