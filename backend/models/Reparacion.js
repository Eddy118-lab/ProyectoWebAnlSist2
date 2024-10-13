import sequelize from "../database/db.js"; // Ajusta la ruta según tu estructura
import { DataTypes } from "sequelize";
import Vehiculo from './Vehiculo.js'; // Asegúrate de tener la relación con Vehiculo

const Reparacion = sequelize.define('Reparacion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'clave primaria de la tabla reparacion'
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'fecha de la reparacion realizada'
    },
    descripcion: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: 'descripcion de la reparacion realizada'
    },
    costo: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'costo total de la reparacion realizada'
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
    tableName: 'reparacion',
    timestamps: false,
    comment: 'Tabla para almacenar la información de las reparaciones de los vehículos'
});

// Relación
Reparacion.belongsTo(Vehiculo, {
    foreignKey: 'vehiculo_id',
    as: 'vehiculo'
});

export default Reparacion;
