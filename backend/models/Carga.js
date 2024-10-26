import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; // O la ruta a tu configuración de base de datos
import Asignacion from './Asignacion.js';
import Inventario from './Inventario.js';
import Proyecto from './Proyecto.js';

// Definir el modelo de Sequelize para la tabla 'Carga'
const Carga = sequelize.define('Carga', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla carga',
  },
  titulo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    comment: 'titulo de la carga',
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'descripción de la carga',
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'cantidad de la carga',
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'precio unitario de la carga',
  },
  asignacion_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla asignacion',
    references: {
      model: Asignacion,
      key: 'id',
    },
  },
  inventario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla inventario',
    references: {
      model: Inventario,
      key: 'id',
    },
  },
  proyecto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla proyecto',
    references: {
      model: Proyecto,
      key: 'id',
    },
  }
}, {
  tableName: 'Carga',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB'
});

// Definir las relaciones con las tablas foráneas
Carga.belongsTo(Asignacion, {
  foreignKey: 'asignacion_id',
  as: 'asignacion'
});

Carga.belongsTo(Inventario, {
  foreignKey: 'inventario_id',
  as: 'inventario'
});

Carga.belongsTo(Proyecto, {
  foreignKey: 'proyecto_id',
  as: 'proyecto'
});

// Exportar el modelo
export default Carga;
