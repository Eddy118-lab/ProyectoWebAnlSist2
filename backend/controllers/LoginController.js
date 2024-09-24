import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const login = async (req, res) => {
    const { email, contrasenha } = req.body;

    if (!email || !contrasenha) {
        return res.status(400).json({ message: 'Faltan credenciales' });
    }

    try {
        const user = await Usuario.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
        }

        // Compara la contraseña enviada con la almacenada en la base de datos
        const validPassword = await bcrypt.compare(contrasenha, user.contrasenha);

        if (!validPassword) {
            return res.status(401).json({ message: 'Usuario o contraseña inválidos' });
        }

        // Generar un token JWT con el id y nombre del usuario
        const token = jwt.sign(
            { id: user.id, nombreComp: user.nombcomp },  // Incluye id y nombre completo
            process.env.JWT_SECRET || 'tu_secreto_jwt',  // Llave secreta para firmar el token
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Tiempo de expiración del token
        );

        res.json({ token });  // Retorna el token al cliente
    } catch (error) {
        console.error('Error en el servidor:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};