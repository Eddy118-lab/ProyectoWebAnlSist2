import FacturaProveedor from '../models/FacturaProveedor.js';
import Proveedor from '../models/Proveedor.js';

// Get all Facturas Proveedores
export const getFacturasProveedores = async (req, res) => {
    try {
        const facturasProveedores = await FacturaProveedor.findAll({
            include: [{ model: Proveedor, as: 'proveedor' }] // Use the defined alias here
        });
        res.json(facturasProveedores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Factura Proveedor by ID
export const getFacturaProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const facturaProveedor = await FacturaProveedor.findOne({
            where: { id },
            include: [{ model: Proveedor, as: 'proveedor' }] // Use the defined alias here
        });

        if (!facturaProveedor) return res.status(404).json({ message: 'Factura de Proveedor no encontrada' });

        res.json(facturaProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Factura Proveedor
export const createFacturaProveedor = async (req, res) => {
    try {
        const { fecha, monto, proveedor_id } = req.body;

        const newFacturaProveedor = await FacturaProveedor.create({
            fecha,
            monto,
            proveedor_id
        });

        res.status(201).json(newFacturaProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing Factura Proveedor
export const updateFacturaProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, monto, proveedor_id } = req.body;

        const facturaProveedor = await FacturaProveedor.findByPk(id);
        if (!facturaProveedor) return res.status(404).json({ message: 'Factura de Proveedor no encontrada' });

        facturaProveedor.fecha = fecha;
        facturaProveedor.monto = monto;
        facturaProveedor.proveedor_id = proveedor_id;

        await facturaProveedor.save();
        res.json(facturaProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Factura Proveedor
export const deleteFacturaProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const facturaProveedor = await FacturaProveedor.findByPk(id);
        if (!facturaProveedor) return res.status(404).json({ message: 'Factura de Proveedor no encontrada' });

        await facturaProveedor.destroy();
        res.json({ message: 'Factura de Proveedor eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
