import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; 

const Dimension = sequelize.define('Dimension', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla dimension'
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'descripción de la dimensión'
  }
}, {
  tableName: 'dimension',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB'
});

export default Dimension;