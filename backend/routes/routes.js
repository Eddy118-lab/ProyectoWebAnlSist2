import express from 'express';
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/UsuarioController.js';
import {getTipoClientes, getTipoClienteById, createTipoCliente, updateTipoCliente, deleteTipoCliente } from '../controllers/TipoClienteController.js';
import {getClientes, getClienteById, createCliente, updateCliente, deleteCliente} from '../controllers/ClienteController.js';
import {getConductores, getConductorById, createConductor, updateConductor, deleteConductor} from '../controllers/ConductorController.js';
import {getProveedores, getProveedorById, createProveedor, updateProveedor, deleteProveedor} from '../controllers/ProveedorController.js';
import {getTipoProveedores, getTipoProveedorById, createTipoProveedor, updateTipoProveedor, deleteTipoProveedor} from '../controllers/TipoProveedorController.js';
import { login } from '../controllers/LoginController.js';
import upload from '../middleware/upload.js';
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


///// CRUD DE CONDUCTOR
router.get('/conductor', getConductores);
router.get('/conductor/:id', getConductorById);
router.post('/conductor', upload.fields([{ name: 'front_imagen_url', maxCount: 1 }, { name: 'tras_imagen_url', maxCount: 1 }]), createConductor); 
router.put('/conductor/:id', upload.fields([{ name: 'front_imagen_url', maxCount: 1 }, { name: 'tras_imagen_url', maxCount: 1 }]), updateConductor);
router.delete('/conductor/:id', deleteConductor);


///// CRUD DE PROVEEDOR
router.get('/proveedor', getProveedores);
router.get('/proveedor/:id', getProveedorById);
router.post('/proveedor', createProveedor);
router.put('/proveedor/:id', updateProveedor);
router.delete('/proveedor/:id', deleteProveedor);

///// CRUD DE TIPO PROVEEDOR
router.get('/tipo-proveedor', getTipoProveedores);
router.get('/tipo-proveedor/:id', getTipoProveedorById);
router.post('/tipo-proveedor', createTipoProveedor);
router.put('/tipo-proveedor/:id', updateTipoProveedor);
router.delete('/tipo-proveedor/:id', deleteTipoProveedor);

///// RUTA LOGIN
router.post('/login', login);

export default router;