import FacturaProveedor from '../models/FacturaProveedor.js';
import DetallFactProveedor from '../models/DetallFactProveedor.js';
import Inventario from '../models/Inventario.js';
import Material from '../models/Material.js';
import PagoProveedor from '../models/PagoProveedor.js';

class ComprasController {
    // Método para crear una nueva compra
    async createPurchase(req, res) {
        const { fecha, monto, proveedor_id, detalles, pagos } = req.body;

        try {
            // Crear la factura del proveedor
            const factura = await FacturaProveedor.create({ fecha, monto, proveedor_id });

            // Procesar cada detalle de la factura
            for (const detalle of detalles) {
                const { cantidad, precio_unitario, descuento, inventario_id } = detalle;

                // Calcular subtotal y total
                const subtotal = precio_unitario * cantidad;
                const total = subtotal - (descuento || 0);

                // Crear detalle de factura
                const detalleFactura = await DetallFactProveedor.create({
                    cantidad,
                    precio_unitario,
                    subtotal,
                    descuento,
                    total,
                    factura_proveedor_id: factura.id,
                    inventario_id
                });

                // Actualizar la cantidad del inventario
                const inventario = await Inventario.findByPk(inventario_id);
                if (inventario) {
                    inventario.cantidad += cantidad; // Incrementar la cantidad
                    await inventario.save();
                }
            }

            // Procesar pagos
            for (const pago of pagos) {
                const { fecha_pago, monto_pago, tipo_pago_id } = pago;
                await PagoProveedor.create({
                    fecha: fecha_pago,
                    monto: monto_pago,
                    factura_proveedor_id: factura.id,
                    tipo_pago_id
                });
            }

            res.status(201).json({ message: 'Compra creada con éxito', factura });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la compra', error });
        }
    }

    // Método para obtener detalles de la compra incluyendo información clara sobre el material
    async getPurchaseDetails(req, res) {
        try {
            const purchases = await DetallFactProveedor.findAll({
                include: [
                    {
                        model: FacturaProveedor,
                        as: 'facturaProveedor',
                        include: {
                            model: Material,
                            as: 'material', // Asociación al modelo de Material
                            attributes: ['nombre', 'descripcion'] // Incluir nombre y descripción
                        }
                    },
                    {
                        model: Inventario,
                        as: 'inventario',
                        attributes: ['id', 'cantidad'], // Información del inventario
                    }
                ]
            });

            // Formatear la respuesta para mayor claridad al usuario
            const formattedPurchases = purchases.map(purchase => ({
                facturaId: purchase.facturaProveedor.id,
                fecha: purchase.facturaProveedor.fecha,
                material: purchase.material.nombre,
                descripcion: purchase.material.descripcion,
                cantidad: purchase.cantidad,
                precio_unitario: purchase.precio_unitario,
                subtotal: purchase.subtotal,
                descuento: purchase.descuento,
                total: purchase.total,
                inventarioId: purchase.inventario.id,
                inventarioCantidad: purchase.inventario.cantidad
            }));

            res.json(formattedPurchases);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener detalles de la compra', error });
        }
    }

    // Método para obtener los pagos de una factura
    async getPayments(req, res) {
        const { facturaId } = req.params;

        try {
            const pagos = await PagoProveedor.findAll({
                where: { factura_proveedor_id: facturaId },
                include: {
                    model: TipoPagoProveedor,
                    as: 'tipoPago',
                    attributes: ['descripcion'] // Información del tipo de pago
                }
            });

            res.json(pagos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener pagos', error });
        }
    }
}

export default new ComprasController();
