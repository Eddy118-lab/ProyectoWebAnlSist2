import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; // O la ruta a tu configuración de base de datos

// Definir el modelo de Sequelize para la tabla 'tipo_estado'
const TipoEstado = sequelize.define('TipoEstado', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    comment: 'clave primaria de la tabla tipo de marca'
  },
  descripcion: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'breve descripción del tipo de estado',
  }
}, {
  tableName: 'tipo_estado',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB',
});

// Exportar el modelo
export default TipoEstado;

