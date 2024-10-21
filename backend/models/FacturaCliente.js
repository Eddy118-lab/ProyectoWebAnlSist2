import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import Cliente from './Cliente.js';

const FacturaCliente = sequelize.define('FacturaCliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'clave primaria de la tabla factura_cliente'
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
    cliente_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Cliente', // Aquí se hace referencia al modelo Cliente
            key: 'id'
        },
        allowNull: false,
        comment: 'clave foranea de la tabla cliente'
    }
}, {
    tableName: 'factura_cliente',
    timestamps: false
});

// Define relationship with Cliente with an alias
FacturaCliente.belongsTo(Cliente, {
    foreignKey: 'cliente_id',
    as: 'cliente' // Este alias debe coincidir en el controlador
});

export default FacturaCliente;

