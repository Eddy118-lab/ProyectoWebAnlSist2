import PagoCliente from '../models/PagoCliente.js'; // Asegúrate de que este modelo esté disponible
import FacturaCliente from '../models/FacturaCliente.js'; // Asegúrate de que este modelo esté disponible
import TipoPagoCliente from '../models/TipoPagoCliente.js'; // Asegúrate de que este modelo esté disponible

// Obtener todos los pagos agrupados por factura_cliente
export const getPagosClientesGroupedByFactura = async (req, res) => {
    try {
        const pagosClientes = await PagoCliente.findAll({
            include: [
                {
                    model: FacturaCliente,
                    as: 'factura_cliente',
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: TipoPagoCliente,
                    as: 'tipo_pago_cliente',
                    attributes: ['descripcion'],
                }
            ],
            attributes: ['id', 'fecha', 'monto'],
            order: [['factura_cliente_id', 'ASC']]  // Agrupar por factura_cliente_id
        });

        // Agrupando los pagos por factura_cliente_id
        const groupedPagos = pagosClientes.reduce((acc, pago) => {
            const facturaId = pago.factura_cliente.id;
            if (!acc[facturaId]) {
                acc[facturaId] = {
                    factura: pago.factura_cliente,
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

// Obtener un solo pago por ID
export const getPagoClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const pagoCliente = await PagoCliente.findByPk(id, {
            include: [
                {
                    model: FacturaCliente,
                    as: 'factura_cliente',
                    attributes: ['id', 'fecha', 'monto'],
                },
                {
                    model: TipoPagoCliente,
                    as: 'tipo_pago_cliente',
                    attributes: ['descripcion'],
                }
            ],
            attributes: ['id', 'fecha', 'monto']
        });

        if (!pagoCliente) return res.status(404).json({ message: 'Pago no encontrado' });

        res.json(pagoCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo pago
export const createPagoCliente = async (req, res) => {
    try {
        const { fecha, monto, factura_cliente_id, tipo_pago_clien_id } = req.body;

        const newPagoCliente = await PagoCliente.create({
            fecha,
            monto,
            factura_cliente_id,
            tipo_pago_clien_id
        });

        res.status(201).json(newPagoCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un pago existente
export const updatePagoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, monto, factura_cliente_id, tipo_pago_cliente_id } = req.body;

        const pagoCliente = await PagoCliente.findByPk(id);
        if (!pagoCliente) return res.status(404).json({ message: 'Pago no encontrado' });

        pagoCliente.fecha = fecha;
        pagoCliente.monto = monto;
        pagoCliente.factura_cliente_id = factura_cliente_id;
        pagoCliente.tipo_pago_cliente_id = tipo_pago_cliente_id;

        await pagoCliente.save();
        res.json(pagoCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un pago
export const deletePagoCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const pagoCliente = await PagoCliente.findByPk(id);
        if (!pagoCliente) return res.status(404).json({ message: 'Pago no encontrado' });

        await pagoCliente.destroy();
        res.json({ message: 'Pago eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
