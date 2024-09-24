import express from 'express';
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/UsuarioController.js';
import {getTipoClientes, getTipoClienteById, createTipoCliente, updateTipoCliente, deleteTipoCliente } from '../controllers/TipoClienteController.js';
import {getClientes, getClienteById, createCliente, updateCliente, deleteCliente} from '../controllers/ClienteController.js';
import { login } from '../controllers/LoginController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

///// CRUD DE USUARIO
router.get('/usuarios', authenticateToken, getUsuarios);          
router.get('/usuarios/:id', authenticateToken, getUsuarioById);    
router.post('/usuarios', authenticateToken, createUsuario);        
router.put('/usuarios/:id', authenticateToken, updateUsuario);     
router.delete('/usuarios/:id', authenticateToken, deleteUsuario);

///// CRUD DE CLIENTE
router.get('/clientes', authenticateToken, getClientes);
router.get('/clientes/:id', authenticateToken, getClienteById);
router.post('/clientes', authenticateToken, createCliente);
router.put('/clientes/:id', authenticateToken, updateCliente);
router.delete('/clientes/:id', authenticateToken, deleteCliente);

///// CRUD DE TIPO CLIENTE
router.get('/tipo-clientes', authenticateToken, getTipoClientes);
router.get('/tipo-clientes/:id', authenticateToken, getTipoClienteById);
router.post('/tipo-clientes', authenticateToken, createTipoCliente);
router.put('/tipo-clientes/:id', authenticateToken, updateTipoCliente);
router.delete('/tipo-clientes/:id', authenticateToken, deleteTipoCliente);

///// RUTA LOGIN
router.post('/login', login);

export default router;