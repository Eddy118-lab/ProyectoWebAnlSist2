import DetallFactProveedor from '../models/DetallFactProveedor.js';
import FacturaProveedor from '../models/FacturaProveedor.js';
import Inventario from '../models/Inventario.js';

// Get all Detalles grouped by FacturaProveedor
export const getDetallesFactProveedoresGroupedByFactura = async (req, res) => {
    try {
        const detallesFactProveedor = await DetallFactProveedor.findAll({
            include: [
                {
                    model: FacturaProveedor,
                    as: 'facturaProveedor', // Asegúrate de que el alias coincida
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: Inventario,
                    as: 'inventario',
                    attributes: ['id', 'precio_unitario', 'cantidad', 'fecha_ingreso'], // Añadir otros campos relevantes si es necesario
                }
            ],
            attributes: ['id', 'cantidad', 'precio_unitario', 'subtotal', 'descuento', 'total'],
            order: [['factura_proveedor_id', 'ASC']]  // Agrupar por factura_proveedor_id
        });

        // Agrupando los detalles por facturaProveedor_id
        const groupedDetalles = detallesFactProveedor.reduce((acc, detalle) => {
            const facturaId = detalle.facturaProveedor.id; // Ajustado para usar el objeto
            const inventarioId = detalle.inventario.id; // Obtener el id del inventario

            if (!acc[facturaId]) {
                acc[facturaId] = {
                    factura: detalle.facturaProveedor,
                    inventarios: [],
                    detalles: []
                };
            }

            // Agregar inventario si no existe
            if (!acc[facturaId].inventarios.some(inv => inv.id === inventarioId)) {
                acc[facturaId].inventarios.push(detalle.inventario);
            }

            acc[facturaId].detalles.push(detalle);
            return acc;
        }, {});

        res.json(Object.values(groupedDetalles));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a single DetallFactProveedor by ID
export const getDetalleFactProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalleFactProveedor = await DetallFactProveedor.findByPk(id, {
            include: [
                {
                    model: FacturaProveedor,
                    as: 'facturaProveedor',
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

        if (!detalleFactProveedor) return res.status(404).json({ message: 'Detalle no encontrado' });

        res.json(detalleFactProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new DetallFactProveedor
export const createDetalleFactProveedor = async (req, res) => {
    try {
        const { cantidad, precio_unitario, subtotal, descuento, total, factura_proveedor_id, inventario_id } = req.body;

        const newDetalleFactProveedor = await DetallFactProveedor.create({
            cantidad,
            precio_unitario,
            subtotal,
            descuento,
            total,
            factura_proveedor_id,
            inventario_id
        });

        res.status(201).json(newDetalleFactProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing DetallFactProveedor
export const updateDetalleFactProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, precio_unitario, subtotal, descuento, total, factura_proveedor_id, inventario_id } = req.body;

        const detalleFactProveedor = await DetallFactProveedor.findByPk(id);
        if (!detalleFactProveedor) return res.status(404).json({ message: 'Detalle no encontrado' });

        detalleFactProveedor.cantidad = cantidad;
        detalleFactProveedor.precio_unitario = precio_unitario;
        detalleFactProveedor.subtotal = subtotal;
        detalleFactProveedor.descuento = descuento;
        detalleFactProveedor.total = total;
        detalleFactProveedor.factura_proveedor_id = factura_proveedor_id;
        detalleFactProveedor.inventario_id = inventario_id;

        await detalleFactProveedor.save();
        res.json(detalleFactProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a DetallFactProveedor
export const deleteDetalleFactProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const detalleFactProveedor = await DetallFactProveedor.findByPk(id);
        if (!detalleFactProveedor) return res.status(404).json({ message: 'Detalle no encontrado' });

        await detalleFactProveedor.destroy();
        res.json({ message: 'Detalle eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
