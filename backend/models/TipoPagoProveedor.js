import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const TipoPagoProveedor = sequelize.define('TipoPagoProveedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    tableName: 'tipo_pago_prov',  // Ensure it matches the actual table name
    timestamps: false  // Disable automatic timestamps (createdAt, updatedAt)
});

export default TipoPagoProveedor;
