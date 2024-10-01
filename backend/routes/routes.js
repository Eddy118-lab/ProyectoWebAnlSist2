import express from 'express';
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/UsuarioController.js';
import {getTipoClientes, getTipoClienteById, createTipoCliente, updateTipoCliente, deleteTipoCliente } from '../controllers/TipoClienteController.js';
import {getClientes, getClienteById, createCliente, updateCliente, deleteCliente} from '../controllers/ClienteController.js';
import { login } from '../controllers/LoginController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

///// CRUD DE USUARIO
router.get('/usuario', getUsuarios);          
router.get('/usuario/:id', getUsuarioById);    
router.post('/usuario', createUsuario);        
router.put('/usuario/:id', updateUsuario);     
router.delete('/usuario/:id', deleteUsuario);

///// CRUD DE CLIENTE
router.get('/cliente', getClientes);
router.get('/cliente/:id', getClienteById);
router.post('/cliente', createCliente);
router.put('/cliente/:id', updateCliente);
router.delete('/cliente/:id', deleteCliente);

///// CRUD DE TIPO CLIENTE
router.get('/tipo-cliente', getTipoClientes);
router.get('/tipo-cliente/:id', getTipoClienteById);
router.post('/tipo-cliente', createTipoCliente);
router.put('/tipo-cliente/:id', updateTipoCliente);
router.delete('/tipo-cliente/:id', deleteTipoCliente);

///// RUTA LOGIN
router.post('/login', login);

export default router;