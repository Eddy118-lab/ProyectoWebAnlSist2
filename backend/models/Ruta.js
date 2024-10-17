import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; // Ajusta la ruta a tu configuración de base de datos

// Definir el modelo de Sequelize para la tabla 'ruta'
const Ruta = sequelize.define('Ruta', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla ruta',
  },
  nombre: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'nombre de la ruta',
  },
  descripcion: {
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: 'descripcion de la ruta',
  },
  origen: {
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: 'punto de partida de la ruta',
  },
  destino: {
    type: DataTypes.STRING(250),
    allowNull: false,
    comment: 'punto de destino de la ruta',
  }
}, {
  tableName: 'ruta',
  timestamps: false, // Desactiva createdAt/updatedAt
  engine: 'InnoDB',
});

// Exportar el modelo
export default Ruta;
