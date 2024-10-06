import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import FacturaProveedor from './FacturaProveedor.js';
import TipoPagoProveedor from './TipoPagoProveedor.js';

const PagoProveedor = sequelize.define('PagoProveedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'clave primaria de la tabla pago_proveedor'
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'fecha del pago realizado al proveedor'
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'cantidad total pagada al proveedor'
    },
    factura_proveedor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: FacturaProveedor,
            key: 'id'
        },
        allowNull: false,
        comment: 'clave foranea de la tabla factura_proveedor'
    },
    tipo_pago_id: {
        type: DataTypes.INTEGER,
        references: {
            model: TipoPagoProveedor,
            key: 'id'
        },
        allowNull: false,
        comment: 'tipo de pago recibido por el proveedor'
    }
}, {
    tableName: 'pago_proveedor',
    timestamps: false
});

// Define relationships
PagoProveedor.belongsTo(FacturaProveedor, { foreignKey: 'factura_proveedor_id' });
PagoProveedor.belongsTo(TipoPagoProveedor, { foreignKey: 'tipo_pago_id' });

export default PagoProveedor;
