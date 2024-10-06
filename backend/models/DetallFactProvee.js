import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import FacturaProveedor from './FacturaProveedor.js';
import Inventario from './Inventario.js';

const DetallFactProvee = sequelize.define('DetallFactProvee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'clave primaria de la tabla detall_fact_provee'
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'cantidad del producto adquirido'
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'precio del producto por metro'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'dato parcial de la compra'
    },
    descuento: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'descuento aplicado en los materiales'
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'resultado de la resta entre el subtotal y el descuento'
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
    inventario_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Inventario,
            key: 'id'
        },
        allowNull: false,
        comment: 'clave foranea de los inventarios abastecidos'
    }
}, {
    tableName: 'detall_fact_provee',
    timestamps: false
});

// Define relationships
DetallFactProvee.belongsTo(FacturaProveedor, { foreignKey: 'factura_proveedor_id' });
DetallFactProvee.belongsTo(Inventario, { foreignKey: 'inventario_id' });

export default DetallFactProvee;
