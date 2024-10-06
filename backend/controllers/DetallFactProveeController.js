import DetallFactProvee from '../models/DetallFactProvee.js';
import FacturaProveedor from '../models/FacturaProveedor.js';
import Inventario from '../models/Inventario.js';

// Get all Detalles grouped by FacturaProveedor
export const getDetallesFactProveedoresGroupedByFactura = async (req, res) => {
    try {
        const detalles = await DetallFactProvee.findAll({
            include: [
                {
                    model: FacturaProveedor,
                    as: 'factura_proveedor',
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: Inventario,
                    as: 'inventario',
                    attributes: ['id', 'precio_unitario', 'cantidad', 'fecha_ingreso'], // Add other relevant fields if needed
                }
            ],
            attributes: ['id', 'cantidad', 'precio_unitario', 'subtotal', 'descuento', 'total'],
            order: [['factura_proveedor_id', 'ASC']]  // Group by factura_proveedor_id
        });

        // Grouping the details by factura_proveedor_id
        const groupedDetalles = detalles.reduce((acc, detalle) => {
            const facturaId = detalle.factura_proveedor_id;
            if (!acc[facturaId]) {
                acc[facturaId] = {
                    factura: detalle.factura_proveedor,
                    detalles: []
                };
            }
            acc[facturaId].detalles.push(detalle);
            return acc;
        }, {});

        res.json(Object.values(groupedDetalles));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single DetallFactProvee by ID
export const getDetalleFactProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetallFactProvee.findByPk(id, {
            include: [
                {
                    model: FacturaProveedor,
                    as: 'factura_proveedor',
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: Inventario,
                    as: 'inventario',
                    attributes: ['id', 'precio_unitario', 'cantidad', 'fecha_ingreso'],
                }
            ],
            attributes: ['id', 'cantidad', 'precio_unitario', 'subtotal', 'descuento', 'total']
        });

        if (!detalle) return res.status(404).json({ message: 'Detalle no encontrado' });

        res.json(detalle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new DetallFactProvee
export const createDetalleFactProveedor = async (req, res) => {
    try {
        const { cantidad, precio_unitario, subtotal, descuento, total, factura_proveedor_id, inventario_id } = req.body;

        const newDetalle = await DetallFactProvee.create({
            cantidad,
            precio_unitario,
            subtotal,
            descuento,
            total,
            factura_proveedor_id,
            inventario_id
        });

        res.status(201).json(newDetalle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing DetallFactProvee
export const updateDetalleFactProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, precio_unitario, subtotal, descuento, total, factura_proveedor_id, inventario_id } = req.body;

        const detalle = await DetallFactProvee.findByPk(id);
        if (!detalle) return res.status(404).json({ message: 'Detalle no encontrado' });

        detalle.cantidad = cantidad;
        detalle.precio_unitario = precio_unitario;
        detalle.subtotal = subtotal;
        detalle.descuento = descuento;
        detalle.total = total;
        detalle.factura_proveedor_id = factura_proveedor_id;
        detalle.inventario_id = inventario_id;

        await detalle.save();
        res.json(detalle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a DetallFactProvee
export const deleteDetalleFactProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const detalle = await DetallFactProvee.findByPk(id);
        if (!detalle) return res.status(404).json({ message: 'Detalle no encontrado' });

        await detalle.destroy();
        res.json({ message: 'Detalle eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
