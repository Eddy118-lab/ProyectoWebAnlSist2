import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; // O la ruta a tu configuración de base de datos

// Definir el modelo de Sequelize para la tabla 'tipo_proveedor'
const TipoProveedor = sequelize.define('TipoProveedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla tipo de proveedor',
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'breve explicación del tipo de proveedor',
  }
}, {
  tableName: 'tipo_proveedor',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB',
});

// Exportar el modelo
export default TipoProveedor;
