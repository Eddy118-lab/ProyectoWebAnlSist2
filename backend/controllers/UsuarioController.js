import Usuario from "../models/Usuario.js";
import bcrypt from 'bcrypt';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
    try {
        const { contrasenha, ...resto } = req.body;

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasenha, salt);

        // Crear el nuevo usuario
        await Usuario.create({ ...resto, contrasenha: hashedPassword });

        res.status(201).json({ message: "Usuario creado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
    const { id } = req.params;
    const { contrasenha, nombcomp, email, fechanaci, nit, dpi, direccion, telefono } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Si se va a actualizar la contraseña
        if (contrasenha) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(contrasenha, salt);
            usuario.contrasenha = hashedPassword;
        }

        // Actualizar otros campos
        usuario.nombcomp = nombcomp || usuario.nombcomp;
        usuario.email = email || usuario.email;
        usuario.fechanaci = fechanaci || usuario.fechanaci;
        usuario.nit = nit || usuario.nit;
        usuario.dpi = dpi || usuario.dpi;
        usuario.direccion = direccion || usuario.direccion;
        usuario.telefono = telefono || usuario.telefono;

        // Guardar los cambios
        await usuario.save();

        res.json({ message: "Usuario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
    try {
        const result = await Usuario.destroy({
            where: { id: req.params.id }
        });

        if (result === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
