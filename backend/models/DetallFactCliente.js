import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import FacturaCliente from './FacturaCliente.js';
import Carga from './Carga.js'; // Asegúrate de importar el modelo Carga

const DetallFactCliente = sequelize.define('DetallFactCliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'clave primaria de la tabla detall_fact_cliente'
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'cantidad del producto adquirido'
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'precio del producto por unidad'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'dato parcial de la compra'
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'descuento aplicado en los productos'
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'resultado de la resta entre el subtotal y el descuento'
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
    carga_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Carga,
            key: 'id'
        },
        allowNull: false,
        comment: 'clave foranea de la tabla carga'
    }
}, {
    tableName: 'detall_fact_client',
    timestamps: false
});

// Define relationships
DetallFactCliente.belongsTo(FacturaCliente, { foreignKey: 'factura_cliente_id', as: 'facturaCliente' });
DetallFactCliente.belongsTo(Carga, { foreignKey: 'carga_id', as: 'carga' });

export default DetallFactCliente;
