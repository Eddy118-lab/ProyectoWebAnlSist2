import sequelize from "../database/db.js"; // Ajusta la ruta según tu estructura
import { DataTypes } from "sequelize";

const TipoMarca = sequelize.define('TipoMarca', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'clave primaria de la tabla tipo de marca'
    },
    nombre: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'explicacion de la marca del vehiculo'
    }
}, {
    tableName: 'tipo_marca',
    timestamps: false,
    comment: 'Tabla para almacenar los tipos de marca de vehículos',
});

export default TipoMarca;
