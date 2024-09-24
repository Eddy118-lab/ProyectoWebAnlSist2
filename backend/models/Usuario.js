import { DataTypes } from 'sequelize';
import sequelize from '../database/db.js';

const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    nombcomp: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'nombre completo del usuario'
    },
    nombusuar: {
      type: DataTypes.STRING(45),
      allowNull: false,
      comment: 'nombre unico de usuario',
      unique: true
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      comment: 'correo electronico del usuario',
      unique: true
    },
    contrasenha: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'contraseña de acceso al sistema'
    },
    fechanaci: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: 'cumpleaños del usuario'
    },
    nit: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: 'NIT del usuario',
      unique: true
    },
    direccion: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'domicilio del usuario'
    },
    dpi: {
      type: DataTypes.STRING(16),
      allowNull: false,
      comment: 'DPI del usuario',
      unique: true
    },
    telefono: {
      type: DataTypes.STRING(10),
      allowNull: false,
      comment: 'numero de telefono del usuario'
    }
  }, {
    tableName: 'usuario',
    timestamps: false, 
    engine: 'InnoDB'
  });
  
  export default Usuario;