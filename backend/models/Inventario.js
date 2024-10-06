import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; 
import Material from './Material.js';   

const Inventario = sequelize.define('Inventario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    precio_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fecha_ingreso: {
        type: DataTypes.DATE,
        allowNull: false
    },
    stock_min: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    stock_max: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    material_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Material,  // Reference to the Material model
            key: 'id'
        },
        allowNull: false
    }
}, {
    tableName: 'inventario',
    timestamps: false  // Disable the automatic timestamps (createdAt, updatedAt)
});

// Define the relationship with the Material model
Inventario.belongsTo(Material, { as: 'material', foreignKey: 'material_id' });

export default Inventario;
