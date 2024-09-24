import express from 'express';
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/UsuarioController.js';
import { login } from '../controllers/LoginController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Rutas para CRUD de usuarios
router.get('/usuarios', authenticateToken, getUsuarios);           // Obtener todos los usuarios (protegido)
router.get('/usuarios/:id', authenticateToken, getUsuarioById);    // Obtener un usuario por ID (protegido)
router.post('/usuarios', authenticateToken, createUsuario);        // Crear un nuevo usuario (protegido)
router.put('/usuarios/:id', authenticateToken, updateUsuario);     // Actualizar un usuario (protegido)
router.delete('/usuarios/:id', authenticateToken, deleteUsuario);  // Eliminar un usuario (protegido)

// Ruta para login (sin protección)
router.post('/login', login);

export default router;