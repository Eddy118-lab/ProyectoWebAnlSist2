import TipoPagoProveedor from '../models/TipoPagoProveedor.js';

// Get all TipoPagoProveedor
export const getTiposPagoProveedor = async (req, res) => {
    try {
        const tiposPagoProveedores = await TipoPagoProveedor.findAll();
        res.json(tiposPagoProveedores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single TipoPagoProveedor by ID
export const getTipoPagoProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoPagoProveedor = await TipoPagoProveedor.findByPk(id);

        if (!tipoPagoProveedor) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        res.json(tipoPagoProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new TipoPagoProveedor
export const createTipoPagoProveedor = async (req, res) => {
    try {
        const { descripcion } = req.body;

        const newTipoPagoProveedor = await TipoPagoProveedor.create({
            descripcion
        });

        res.status(201).json(newTipoPagoProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing TipoPagoProveedor
export const updateTipoPagoProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        const tipoPagoProveedor = await TipoPagoProveedor.findByPk(id);
        if (!tipoPagoProveedor) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        tipoPagoProveedor.descripcion = descripcion;

        await tipoPagoProveedor.save();
        res.json(tipoPagoProveedor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a TipoPagoProveedor
export const deleteTipoPagoProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        const tipoPagoProveedor = await TipoPagoProveedor.findByPk(id);
        if (!tipoPagoProveedor) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        await tipoPagoProveedor.destroy();
        res.json({ message: 'Tipo de pago eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
