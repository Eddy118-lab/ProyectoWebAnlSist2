import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";

const Conductor = sequelize.define("Conductor", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        comment: 'clave primaria de la tabla conductor',
    },
    primer_nom: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'nombre del conductor',
    },
    segundo_nombre: {
        type: DataTypes.STRING(75),
        allowNull: false,
        comment: 'nombre del conductor',
    },
    primer_apell: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'apellido del conductor',
    },
    segundo_apell: {
        type: DataTypes.STRING(45),
        allowNull: false,
        comment: 'apellido del conductor',
    },
    no_licencia: {
        type: DataTypes.STRING(16),
        allowNull: false,
        unique: true,
        comment: 'numero de licencia del conductor',
    },
    telefono: {
        type: DataTypes.STRING(10),
        allowNull: false,
        comment: 'telefono del conductor',
    },
    email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Valida que el formato sea de un correo electrónico
        },
        comment: 'email del conductor',
    },
    fecha_contratacion: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'fecha de contratacion del conductor',
    },
    front_imagen_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'imagen de referencia de la licencia del conductor parte frontal',
    },
    tras_imagen_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'imagen de referencia de la licencia del conductor parte trasera',
    },
}, {
    tableName: "conductor", // Nombre de la tabla en la base de datos
    timestamps: false, // Si no se utilizan los campos createdAt y updatedAt
});

// Se define un índice único para no_licencia
Conductor.addHook("afterDefine", (model) => {
    model.addIndex({
        fields: ['no_licencia'],
        unique: true,
        name: 'no_licencia_UNIQUE',
    });
});

// Se define un índice único para email
Conductor.addHook("afterDefine", (model) => {
    model.addIndex({
        fields: ['email'],
        unique: true,
        name: 'email_UNIQUE',
    });
});

export default Conductor;
