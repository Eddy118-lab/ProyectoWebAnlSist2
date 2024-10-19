import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; // O la ruta a tu configuración de base de datos
import Conductor from './Conductor.js';
import Vehiculo from './Vehiculo.js';
import Ruta from './Ruta.js';
import TipoEstado from './TipoEstado.js';

// Definir el modelo de Sequelize para la tabla 'asignacion'
const Asignacion = sequelize.define('Asignacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla asignacion',
  },
  fecha_asignacion: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'fecha en que se realiza la asignación',
  },
  conductor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla conductor',
    references: {
      model: Conductor,
      key: 'id',
    },
  },
  vehiculo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla vehiculo',
    references: {
      model: Vehiculo,
      key: 'id',
    },
  },
  ruta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla ruta',
    references: {
      model: Ruta,
      key: 'id',
    },
  },
  tipo_estado_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla tipo_estado',
    references: {
      model: TipoEstado,
      key: 'id',
    },
  }
}, {
  tableName: 'asignacion',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB'
});

// Definir las relaciones con las tablas foráneas
Asignacion.belongsTo(Conductor, {
  foreignKey: 'conductor_id',
  as: 'conductor'
});

Asignacion.belongsTo(Vehiculo, {
  foreignKey: 'vehiculo_id',
  as: 'vehiculo'
});

Asignacion.belongsTo(Ruta, {
  foreignKey: 'ruta_id',
  as: 'ruta'
});

Asignacion.belongsTo(TipoEstado, {
  foreignKey: 'tipo_estado_id',
  as: 'tipoEstado'
});

// Exportar el modelo
export default Asignacion;
