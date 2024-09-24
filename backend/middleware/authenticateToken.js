import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Captura el token del header

    if (token == null) return res.sendStatus(401); // No hay token, acceso no autorizado

    jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt', (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido o expirado
        req.user = user; // Agrega la información del usuario verificado a la request
        next(); // Continúa con el siguiente middleware o controlador
    });
};

export default authenticateToken;