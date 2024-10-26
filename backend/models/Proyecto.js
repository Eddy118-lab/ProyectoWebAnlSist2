import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

// Definir el modelo de Sequelize para la tabla 'Proyecto'
const Proyecto = sequelize.define('Proyecto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla proyecto',
  },
  nombre: {
    type: DataTypes.STRING(175),
    allowNull: false,
    comment: 'nombre del proyecto',
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'descripción del proyecto',
  },
  estado: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'estado del proyecto, como activo o inactivo',
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'fecha de inicio del proyecto',
  },
  fecha_fin: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'fecha de finalización del proyecto, si está finalizado',
  },
  fecha_ult_actua: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'fecha de la última actualización del proyecto',
  }
}, {
  tableName: 'proyecto',
  timestamps: false,
  engine: 'InnoDB'
});

// Exportar el modelo
export default Proyecto;
