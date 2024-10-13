import sequelize from "../database/db.js"; // Ajusta la ruta según tu estructura
import { DataTypes } from "sequelize";
import TipoMarca from './TipoMarca.js'; // Asegúrate de tener la relación adecuada

const Vehiculo = sequelize.define('Vehiculo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'clave primaria de la tabla vehiculo'
    },
    placa: {
        type: DataTypes.STRING(9),
        allowNull: false,
        unique: true,
        comment: 'numero de placa del vehiculo'
    },
    modelo: {
        type: DataTypes.STRING(5),
        allowNull: false,
        comment: 'modelo del vehiculo'
    },
    estado: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'estado de disponibilidad del vehiculo'
    },
    tipo_marca_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TipoMarca,
            key: 'id'
        },
        comment: 'clave foranea'
    }
}, {
    tableName: 'vehiculo',
    timestamps: false,
    comment: 'Tabla para almacenar la información de los vehículos',
});

// Relación
Vehiculo.belongsTo(TipoMarca, {
    foreignKey: 'tipo_marca_id',
    as: 'tipoMarca' // Esto es opcional, pero te ayuda a nombrar la relación
});

export default Vehiculo;
