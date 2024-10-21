import DetallFactCliente from '../models/DetallFactCliente.js';
import FacturaCliente from '../models/FacturaCliente.js'; // Asegúrate de que este modelo esté disponible
import Carga from '../models/Carga.js'; // Asegúrate de que este modelo esté disponible

// Get all Detalles grouped by FacturaCliente
export const getDetallesFactClientesGroupedByFactura = async (req, res) => {
    try {
        const detallesFactCliente = await DetallFactCliente.findAll({
            include: [
                {
                    model: FacturaCliente,
                    as: 'facturaCliente', // Asegúrate de que el alias coincida
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: Carga,
                    as: 'carga', // Asegúrate de que el alias coincida
                    attributes: ['id', 'nombre', 'descripcion', 'precio_unitario'],
                }
            ],
            attributes: ['id', 'cantidad', 'precio_unitario', 'subtotal', 'descuento', 'total'],
            order: [['factura_cliente_id', 'ASC']]  // Agrupar por factura_cliente_id
        });

        // Agrupando los detalles por facturaCliente_id
        const groupedDetalles = detallesFactCliente.reduce((acc, detalle) => {
            const facturaId = detalle.facturaCliente.id; // Ajustado para usar el objeto
            const cargaId = detalle.carga.id; // Obtener el id de la carga

            if (!acc[facturaId]) {
                acc[facturaId] = {
                    factura: detalle.facturaCliente,
                    cargas: [],
                    detalles: []
                };
            }

            // Agregar carga si no existe
            if (!acc[facturaId].cargas.some(c => c.id === cargaId)) {
                acc[facturaId].cargas.push(detalle.carga);
            }

            acc[facturaId].detalles.push(detalle);
            return acc;
        }, {});

        res.json(Object.values(groupedDetalles));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single DetallFactCliente by ID
export const getDetalleFactClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalleFactCliente = await DetallFactCliente.findByPk(id, {
            include: [
                {
                    model: FacturaCliente,
                    as: 'facturaCliente',
                    attributes: ['id', 'fecha', 'monto', 'cliente_id'], // Añadir cliente_id aquí
                },
                {
                    model: Carga,
                    as: 'carga',
                    attributes: ['id', 'descripcion', 'precio_unitario', 'asignacion_id', 'inventario_id'],
                }
            ],
            attributes: ['id', 'cantidad', 'precio_unitario', 'subtotal', 'descuento', 'total']
        });

        if (!detalleFactCliente) return res.status(404).json({ message: 'Detalle no encontrado' });

        res.json(detalleFactCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new DetallFactCliente
export const createDetalleFactCliente = async (req, res) => {
    try {
        const { cantidad, precio_unitario, subtotal, descuento, total, factura_cliente_id, carga_id } = req.body;

        const newDetalleFactCliente = await DetallFactCliente.create({
            cantidad,
            precio_unitario,
            subtotal,
            descuento,
            total,
            factura_cliente_id,
            carga_id
        });

        res.status(201).json(newDetalleFactCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing DetallFactCliente
export const updateDetalleFactCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { cantidad, precio_unitario, subtotal, descuento, total, factura_cliente_id, carga_id } = req.body;

        const detalleFactCliente = await DetallFactCliente.findByPk(id);
        if (!detalleFactCliente) return res.status(404).json({ message: 'Detalle no encontrado' });

        detalleFactCliente.cantidad = cantidad;
        detalleFactCliente.precio_unitario = precio_unitario;
        detalleFactCliente.subtotal = subtotal;
        detalleFactCliente.descuento = descuento;
        detalleFactCliente.total = total;
        detalleFactCliente.factura_cliente_id = factura_cliente_id;
        detalleFactCliente.carga_id = carga_id;

        await detalleFactCliente.save();
        res.json(detalleFactCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a DetallFactCliente
export const deleteDetalleFactCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const detalleFactCliente = await DetallFactCliente.findByPk(id);
        if (!detalleFactCliente) return res.status(404).json({ message: 'Detalle no encontrado' });

        await detalleFactCliente.destroy();
        res.json({ message: 'Detalle eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
