import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; // O la ruta a tu configuración de base de datos
import TipoProveedor from './TipoProveedor.js'; // Importa el modelo de tipo_proveedor para la relación

// Definir el modelo de Sequelize para la tabla 'proveedor'
const Proveedor = sequelize.define('Proveedor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla proveedor',
  },
  nombre: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'nombre de la persona jurídica o individual de los proveedores',
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'dirección de la persona jurídica o individual de los proveedores',
  },
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'teléfono de la persona jurídica o individual de los proveedores',
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    comment: 'email de la persona jurídica o individual de los proveedores',
  },
  nit: {
    type: DataTypes.STRING(16),
    allowNull: false,
    unique: true,
    comment: 'número de identificación tributaria',
  },
  tipo_proveedor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foránea proveniente de la tabla tipo_proveedor',
    references: {
      model: TipoProveedor, // Referencia al modelo tipo_proveedor
      key: 'id',
    },
  },
}, {
  tableName: 'proveedor',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB',
});

// Definir la relación con tipo_proveedor (clave foránea)
Proveedor.belongsTo(TipoProveedor, {
  foreignKey: 'tipo_proveedor_id',
  as: 'tipoProveedor', // Alias para la relación
});

// Exportar el modelo
export default Proveedor;
