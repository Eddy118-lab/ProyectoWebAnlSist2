import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const TipoMaterial = sequelize.define('TipoMaterial', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla tipo_material'
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'descripción del tipo de material'
  }
}, {
  tableName: 'tipo_material',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB'
});

export default TipoMaterial;