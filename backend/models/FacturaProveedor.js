import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import Proveedor from './Proveedor.js';

const FacturaProveedor = sequelize.define('FacturaProveedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'clave primaria de la tabla factura_proveedor'
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'fecha de emision de la factura'
    },
    monto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'precio total de la factura'
    },
    proveedor_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Proveedor,
            key: 'id'
        },
        allowNull: false,
        comment: 'clave foranea de la tabla proveedor'
    }
}, {
    tableName: 'factura_proveedor',
    timestamps: false
});

// Define relationship with Proveedor with an alias
FacturaProveedor.belongsTo(Proveedor, {
    foreignKey: 'proveedor_id',
    as: 'proveedor' // This alias must match in the controller
});

export default FacturaProveedor;
