import FacturaProveedor from '../models/FacturaProveedor.js';
import Proveedor from '../models/Proveedor.js';

// Get all Facturas Proveedores
export const getFacturasProveedores = async (req, res) => {
    try {
        const facturas = await FacturaProveedor.findAll({
            include: [{ model: Proveedor, as: 'proveedor' }]
        });
        res.json(facturas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Factura Proveedor by ID
export const getFacturaProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const factura = await FacturaProveedor.findOne({
            where: { id },
            include: [{ model: Proveedor, as: 'proveedor' }]
        });

        if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });

        res.json(factura);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new Factura Proveedor
export const createFacturaProveedor = async (req, res) => {
    try {
        const { fecha, monto, proveedor_id } = req.body;

        const newFactura = await FacturaProveedor.create({
            fecha,
            monto,
            proveedor_id
        });

        res.status(201).json(newFactura);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing Factura Proveedor
export const updateFacturaProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, monto, proveedor_id } = req.body;

        const factura = await FacturaProveedor.findByPk(id);
        if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });

        factura.fecha = fecha;
        factura.monto = monto;
        factura.proveedor_id = proveedor_id;

        await factura.save();
        res.json(factura);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a Factura Proveedor
export const deleteFacturaProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const factura = await FacturaProveedor.findByPk(id);
        if (!factura) return res.status(404).json({ message: 'Factura no encontrada' });

        await factura.destroy();
        res.json({ message: 'Factura eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
