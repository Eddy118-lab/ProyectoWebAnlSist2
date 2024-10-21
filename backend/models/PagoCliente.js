import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import FacturaCliente from './FacturaCliente.js'; // Asegúrate de tener este modelo
import TipoPagoCliente from './TipoPagoCliente.js'; // Asegúrate de tener este modelo

const PagoCliente = sequelize.define('PagoCliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'clave primaria de la tabla pago_cliente'
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'fecha del pago realizado al cliente'
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'cantidad total pagada por el cliente'
    },
    factura_cliente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: FacturaCliente,
            key: 'id'
        },
        allowNull: false,
        comment: 'clave foranea de la tabla factura_cliente'
    },
    tipo_pago_clien_id: {
        type: DataTypes.INTEGER,
        references: {
            model: TipoPagoCliente,
            key: 'id'
        },
        allowNull: false,
        comment: 'tipo de pago recibido por el cliente'
    }
}, {
    tableName: 'pago_cliente', // Asegúrate de que coincida con el nombre real de la tabla
    timestamps: false
});

// Define relationships
PagoCliente.belongsTo(FacturaCliente, { foreignKey: 'factura_cliente_id', as: 'factura_cliente' });
PagoCliente.belongsTo(TipoPagoCliente, { foreignKey: 'tipo_pago_clien_id', as: 'tipo_pago_cliente' });

export default PagoCliente;
