import sequelize from "../database/db.js"; // Ajusta la ruta según tu estructura
import { DataTypes } from "sequelize";
import Vehiculo from './Vehiculo.js'; // Asegúrate de tener la relación con Vehiculo

const Combustible = sequelize.define('Combustible', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'clave primaria de la tabla combustible'
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'fecha de uso del combustible'
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'galones adquiridos para el vehiculo'
    },
    costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'costo total del combustible adquirido'
    },
    vehiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Vehiculo,
            key: 'id'
        },
        comment: 'clave foranea de la tabla vehiculo'
    }
}, {
    tableName: 'combustible',
    timestamps: false,
    comment: 'Tabla para almacenar la información del combustible adquirido para los vehículos'
});

// Relación
Combustible.belongsTo(Vehiculo, {
    foreignKey: 'vehiculo_id',
    as: 'vehiculo'
});

export default Combustible;
