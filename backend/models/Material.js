import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';
import Dimension from './Dimension.js';
import Peso from './Peso.js'; 
import TipoMaterial from './TipoMaterial.js'; 
import Proveedor from './Proveedor.js'; 

// Definir el modelo de Sequelize para la tabla 'material'
const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla material'
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'nombre del material'
  },
  descripcion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'descripción del material'
  },
  imagen_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'URL de la imagen del material'
  },
  dimension_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla dimension',
    references: {
      model: Dimension, // Referencia al modelo dimension
      key: 'id'
    }
  },
  peso_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla peso',
    references: {
      model: Peso, // Referencia al modelo peso
      key: 'id'
    }
  },
  tipo_material_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla tipo_material',
    references: {
      model: TipoMaterial, // Referencia al modelo tipo_material
      key: 'id'
    }
  },
  proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla proveedor',
    references: {
      model: Proveedor, // Referencia al modelo proveedor
      key: 'id'
    }
  }
}, {
  tableName: 'material',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB'
});

// Definir las relaciones con las tablas correspondientes
Material.belongsTo(Dimension, {
  foreignKey: 'dimension_id',
  as: 'dimension'
});

Material.belongsTo(Peso, {
  foreignKey: 'peso_id',
  as: 'peso'
});

Material.belongsTo(TipoMaterial, {
  foreignKey: 'tipo_material_id',
  as: 'tipoMaterial'
});

Material.belongsTo(Proveedor, {
  foreignKey: 'proveedor_id',
  as: 'proveedor'
});

export default Material;
