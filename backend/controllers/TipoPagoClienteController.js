import TipoPagoCliente from '../models/TipoPagoCliente.js'; // Asegúrate de que este modelo esté disponible

// Get all TipoPagoCliente
export const getTiposPagoCliente = async (req, res) => {
    try {
        const tiposPagoClientes = await TipoPagoCliente.findAll();
        res.json(tiposPagoClientes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single TipoPagoCliente by ID
export const getTipoPagoClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const tipoPagoCliente = await TipoPagoCliente.findByPk(id);

        if (!tipoPagoCliente) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        res.json(tipoPagoCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new TipoPagoCliente
export const createTipoPagoCliente = async (req, res) => {
    try {
        const { descripcion } = req.body;

        const newTipoPagoCliente = await TipoPagoCliente.create({
            descripcion
        });

        res.status(201).json(newTipoPagoCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an existing TipoPagoCliente
export const updateTipoPagoCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        const tipoPagoCliente = await TipoPagoCliente.findByPk(id);
        if (!tipoPagoCliente) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        tipoPagoCliente.descripcion = descripcion;

        await tipoPagoCliente.save();
        res.json(tipoPagoCliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a TipoPagoCliente
export const deleteTipoPagoCliente = async (req, res) => {
    try {
        const { id } = req.params;

        const tipoPagoCliente = await TipoPagoCliente.findByPk(id);
        if (!tipoPagoCliente) return res.status(404).json({ message: 'Tipo de pago no encontrado' });

        await tipoPagoCliente.destroy();
        res.json({ message: 'Tipo de pago eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
