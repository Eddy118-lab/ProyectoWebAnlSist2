import sequelize from "../database/db.js";
import { DataTypes } from "sequelize";

const TipoCliente = sequelize.define('TipoCliente', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        comment: 'clave primaria de la tabla tipo_cliente'
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'descripcion breve del tipo de cliente existente'
    }
}, {
    tableName: 'tipo_cliente',
    timestamps: false,
    comment: 'Tabla para almacenar los tipos de clientes',
});

export default TipoCliente;