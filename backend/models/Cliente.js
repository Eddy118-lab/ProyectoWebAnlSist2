// Importar Sequelize
import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js'; // O la ruta a tu configuración de base de datos
import TipoCliente from './TipoCliente.js'; // Importa el modelo de tipo_cliente para la relación

// Definir el modelo de Sequelize para la tabla 'cliente'
const Cliente = sequelize.define('Cliente', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    comment: 'clave primaria de la tabla cliente'
  },
  nombre: {
    type: DataTypes.STRING(45),
    allowNull: false,
    comment: 'nombre de la institucion juridica o individual'
  },
  direccion: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'direccion de la institucion juridica o individual'
  },
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'telefono de la institucion juridica o individual'
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    comment: 'email de la institucion juridica o individual'
  },
  nit: {
    type: DataTypes.STRING(16),
    allowNull: false,
    unique: true,
    comment: 'numero de identificacion tributaria'
  },
  tipo_cliente_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'clave foranea proveniente de la tabla tipo_cliente',
    references: {
      model: TipoCliente, // Referencia al modelo tipo_cliente
      key: 'id'
    }
  }
}, {
  tableName: 'cliente',
  timestamps: false, // Desactiva createdAt/updatedAt si no es necesario
  engine: 'InnoDB'
});

// Definir la relación con tipo_cliente (clave foránea)
Cliente.belongsTo(TipoCliente, {
  foreignKey: 'tipo_cliente_id',
  as: 'tipoCliente'
});

// Exportar el modelo
export default Cliente;