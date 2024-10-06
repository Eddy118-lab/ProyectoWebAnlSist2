import TipoPagoProveedor from '../models/TipoPagoProveedor.js';

// Get all TipoPagoProveedor
export const getTiposPagoProveedor = async (req, res) => {
    try {
        const tiposPago = await TipoPagoProveedor.findAll();
        res.json(tiposPago);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single TipoPagoProveedor by ID
export const getTipoPagoProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoPago = await TipoPagoProveedor.findByPk(id);

        if (!tipoPago) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        res.json(tipoPago);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new TipoPagoProveedor
export const createTipoPagoProveedor = async (req, res) => {
    try {
        const { descripcion } = req.body;

        const newTipoPago = await TipoPagoProveedor.create({
            descripcion
        });

        res.status(201).json(newTipoPago);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing TipoPagoProveedor
export const updateTipoPagoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        const tipoPago = await TipoPagoProveedor.findByPk(id);
        if (!tipoPago) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        tipoPago.descripcion = descripcion;

        await tipoPago.save();
        res.json(tipoPago);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a TipoPagoProveedor
export const deleteTipoPagoProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const tipoPago = await TipoPagoProveedor.findByPk(id);
        if (!tipoPago) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        await tipoPago.destroy();
        res.json({ message: 'Tipo de pago eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
