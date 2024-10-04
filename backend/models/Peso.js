import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; 

const Peso = sequelize.define('Peso', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla peso'
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'descripción del peso'
  }
}, {
  tableName: 'peso',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB'
});

export default Peso;