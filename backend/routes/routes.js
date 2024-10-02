import express from 'express';
import { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/UsuarioController.js';
import {getTipoClientes, getTipoClienteById, createTipoCliente, updateTipoCliente, deleteTipoCliente } from '../controllers/TipoClienteController.js';
import {getClientes, getClienteById, createCliente, updateCliente, deleteCliente} from '../controllers/ClienteController.js';
import {getConductores, getConductorById, createConductor, updateConductor, deleteConductor} from '../controllers/ConductorController.js';
import multer from 'multer';
import { login } from '../controllers/LoginController.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Asignar un nombre único a la imagen
    }
});

const upload = multer({ storage });

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
router.post('/conductor', upload.fields([{ name: 'front_imagen_url' }, { name: 'tras_imagen_url' }]), createConductor); 
router.put('/conductor/:id', upload.fields([{ name: 'front_imagen_url' }, { name: 'tras_imagen_url' }]), updateConductor);
router.delete('/conductor/:id', deleteConductor);

///// RUTA LOGIN
router.post('/login', login);

export default router;