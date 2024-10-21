import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const TipoPagoCliente = sequelize.define('TipoPagoCliente', {
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
    tableName: 'tipo_pago_clien',  // Asegúrate de que coincida con el nombre real de la tabla
    timestamps: false  // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
});

export default TipoPagoCliente;
