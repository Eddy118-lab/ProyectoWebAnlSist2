import PagoProveedor from '../models/PagoProveedor.js';
import FacturaProveedor from '../models/FacturaProveedor.js';
import TipoPagoProveedor from '../models/TipoPagoProveedor.js';

// Get all pagos grouped by FacturaProveedor
export const getPagosProveedoresGroupedByFactura = async (req, res) => {
    try {
        const pagos = await PagoProveedor.findAll({
            include: [
                {
                    model: FacturaProveedor,
                    as: 'factura_proveedor',
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: TipoPagoProveedor,
                    as: 'tipo_pago_proveedor',
                    attributes: ['descripcion'],
                }
            ],
            attributes: ['id', 'fecha', 'monto'],
            order: [['factura_proveedor_id', 'ASC']]  // Group by factura_proveedor_id
        });

        // Grouping the pagos by factura_proveedor_id
        const groupedPagos = pagos.reduce((acc, pago) => {
            const facturaId = pago.factura_proveedor_id;
            if (!acc[facturaId]) {
                acc[facturaId] = {
                    factura: pago.factura_proveedor,
                    pagos: []
                };
            }
            acc[facturaId].pagos.push(pago);
            return acc;
        }, {});

        res.json(Object.values(groupedPagos));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single PagoProveedor by ID
export const getPagoProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const pago = await PagoProveedor.findByPk(id, {
            include: [
                {
                    model: FacturaProveedor,
                    as: 'factura_proveedor',
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: TipoPagoProveedor,
                    as: 'tipo_pago_proveedor',
                    attributes: ['descripcion'],
                }
            ],
            attributes: ['id', 'fecha', 'monto']
        });

        if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });

        res.json(pago);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new PagoProveedor
export const createPagoProveedor = async (req, res) => {
    try {
        const { fecha, monto, factura_proveedor_id, tipo_pago_id } = req.body;

        const newPago = await PagoProveedor.create({
            fecha,
            monto,
            factura_proveedor_id,
            tipo_pago_id
        });

        res.status(201).json(newPago);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing PagoProveedor
export const updatePagoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, monto, factura_proveedor_id, tipo_pago_id } = req.body;

        const pago = await PagoProveedor.findByPk(id);
        if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });

        pago.fecha = fecha;
        pago.monto = monto;
        pago.factura_proveedor_id = factura_proveedor_id;
        pago.tipo_pago_id = tipo_pago_id;

        await pago.save();
        res.json(pago);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a PagoProveedor
export const deletePagoProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const pago = await PagoProveedor.findByPk(id);
        if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });

        await pago.destroy();
        res.json({ message: 'Pago eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
