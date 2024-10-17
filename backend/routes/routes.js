import express from 'express';
import {getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } from '../controllers/UsuarioController.js';
import {getTipoClientes, getTipoClienteById, createTipoCliente, updateTipoCliente, deleteTipoCliente } from '../controllers/TipoClienteController.js';
import {getClientes, getClienteById, createCliente, updateCliente, deleteCliente} from '../controllers/ClienteController.js';
import {getConductores, getConductorById, createConductor, updateConductor, deleteConductor} from '../controllers/ConductorController.js';
import {getProveedores, getProveedorById, createProveedor, updateProveedor, deleteProveedor} from '../controllers/ProveedorController.js';
import {getTipoProveedores, getTipoProveedorById, createTipoProveedor, updateTipoProveedor, deleteTipoProveedor} from '../controllers/TipoProveedorController.js';
import {getDimensiones, getDimensionById, createDimension, updateDimension, deleteDimension} from '../controllers/DimensionController.js';
import {getPesos, getPesoById, createPeso, updatePeso, deletePeso} from '../controllers/PesoController.js';
import {getTipoMateriales, getTipoMaterialById, createTipoMaterial, updateTipoMaterial, deleteTipoMaterial} from '../controllers/TipoMaterialController.js'; 
import {getMateriales, getMaterialById, createMaterial, updateMaterial, deleteMaterial} from '../controllers/MaterialController.js';
import {getInventarios, getInventarioById, createInventario, updateInventario, deleteInventario } from '../controllers/InventarioController.js';
import {getFacturasProveedores, getFacturaProveedorById, createFacturaProveedor, updateFacturaProveedor, deleteFacturaProveedor} from '../controllers/FacturaProveedorController.js';
import {getTiposPagoProveedor, getTipoPagoProveedorById, createTipoPagoProveedor, updateTipoPagoProveedor, deleteTipoPagoProveedor} from '../controllers/TipoPagoProveedorController.js';
import {getDetallesFactProveedoresGroupedByFactura, getDetalleFactProveedorById, createDetalleFactProveedor, updateDetalleFactProveedor, deleteDetalleFactProveedor} from '../controllers/DetallFactProveeController.js';
import {getPagosProveedoresGroupedByFactura, getPagoProveedorById, createPagoProveedor, updatePagoProveedor, deletePagoProveedor} from '../controllers/PagoProveedorController.js';
import {getTipoMarcas, getTipoMarcaById, createTipoMarca, updateTipoMarca, deleteTipoMarca} from '../controllers/TipoMarcaController.js';
import {getVehiculos, getVehiculoById, createVehiculo, updateVehiculo, deleteVehiculo, updateVehiculoEstado} from '../controllers/VehiculoController.js';
import {getReparaciones, getReparacionById, createReparacion, updateReparacion, deleteReparacion} from '../controllers/ReparacionController.js'; 
import {getCombustibles, getCombustibleById, createCombustible, updateCombustible, deleteCombustible} from '../controllers/CombustibleController.js'; 
import { getRutas, getRutaById, createRuta, updateRuta, deleteRuta } from '../controllers/RutaController.js';
import { login } from '../controllers/LoginController.js';
import uploadConductor from '../middleware/uploadConductor.js';
import uploadMaterial from '../middleware/uploadMaterial.js';
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
router.post('/conductor', uploadConductor.fields([{ name: 'front_imagen_url', maxCount: 1 }, { name: 'tras_imagen_url', maxCount: 1 }]), createConductor); 
router.put('/conductor/:id', uploadConductor.fields([{ name: 'front_imagen_url', maxCount: 1 }, { name: 'tras_imagen_url', maxCount: 1 }]), updateConductor);
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

///// CRUD DE DIMENSION
router.get('/dimension', getDimensiones);
router.get('/dimension/:id', getDimensionById);
router.post('/dimension', createDimension);
router.put('/dimension/:id', updateDimension);
router.delete('/dimension/:id', deleteDimension);

///// CRUD DE PESO
router.get('/peso', getPesos);
router.get('/peso/:id', getPesoById);
router.post('/peso', createPeso);
router.put('/peso/:id', updatePeso);
router.delete('/peso/:id', deletePeso);

///// CRUD DE TIPO MATERIAL
router.get('/tipo-material', getTipoMateriales);
router.get('/tipo-material/:id', getTipoMaterialById);
router.post('/tipo-material', createTipoMaterial);
router.put('/tipo-material/:id', updateTipoMaterial);
router.delete('/tipo-material/:id', deleteTipoMaterial);

///// CRUD DE MATERIAL
router.get('/material', getMateriales);
router.get('/material/:id', getMaterialById);
router.post('/material', uploadMaterial.single('imagen_url'), createMaterial);
router.put('/material/:id', uploadMaterial.single('imagen_url'), updateMaterial);
router.delete('/material/:id', deleteMaterial);

///// CRUD DE INVENTARIO
router.get('/inventario', getInventarios);
router.get('/inventario/:id', getInventarioById);
router.post('/inventario', createInventario);
router.put('/inventario/:id', updateInventario);
router.delete('/inventario/:id', deleteInventario);

/////CRUD DE FACTURA
router.get('/factura-proveedor', getFacturasProveedores);
router.get('/factura-proveedor/:id', getFacturaProveedorById);
router.post('/factura-proveedor', createFacturaProveedor);
router.put('/factura-proveedor/:id', updateFacturaProveedor);
router.delete('/factura-proveedor/:id', deleteFacturaProveedor);

/////CRUD DE TIPO PAGO PROVEEDOR
router.get('/tipo-pago-proveedor', getTiposPagoProveedor);
router.get('/tipo-pago-proveedor/:id', getTipoPagoProveedorById);
router.post('/tipo-pago-proveedor', createTipoPagoProveedor);
router.put('/tipo-pago-proveedor/:id', updateTipoPagoProveedor);
router.delete('/tipo-pago-proveedor/:id', deleteTipoPagoProveedor);

/////CRUD DE PAGO PROVEEDOR
router.get('/pago-proveedor', getPagosProveedoresGroupedByFactura); // Obtener pagos agrupados por factura
router.get('/pago-proveedor/:id', getPagoProveedorById);
router.post('/pago-proveedor', createPagoProveedor);
router.put('/pago-proveedor/:id', updatePagoProveedor);
router.delete('/pago-proveedor/:id', deletePagoProveedor);

/////CRUD DE DETALLE FACTURA PROVEEDOR
router.get('/detalle-factura-proveedor', getDetallesFactProveedoresGroupedByFactura);
router.get('/detalle-factura-proveedor/:id', getDetalleFactProveedorById);
router.post('/detalle-factura-proveedor', createDetalleFactProveedor);
router.put('/detalle-factura-proveedor/:id', updateDetalleFactProveedor);
router.delete('/detalle-factura-proveedor/:id', deleteDetalleFactProveedor);

// CRUD DE TIPO MARCAR
router.get('/tipo-marca', getTipoMarcas);
router.get('/tipo-marca/:id', getTipoMarcaById);
router.post('/tipo-marca', createTipoMarca);
router.put('/tipo-marca/:id', updateTipoMarca);
router.delete('/tipo-marca/:id', deleteTipoMarca);

// CRUD DE VEHICULO
router.get('/vehiculo', getVehiculos);
router.get('/vehiculo/:id', getVehiculoById);
router.post('/vehiculo', createVehiculo);
router.put('/vehiculo/:id', updateVehiculo);
router.delete('/vehiculo/:id', deleteVehiculo);
router.patch('/vehiculo/:id/estado', updateVehiculoEstado); // Actualizar estado de un vehículo

// CRUD DE COMBUSTIBLE
router.get('/combustible', getCombustibles); 
router.get('/combustible/:id', getCombustibleById); 
router.post('/combustible', createCombustible); 
router.put('/combustible/:id', updateCombustible);
router.delete('/combustible/:id', deleteCombustible);

// CRUD DE REPARACION 
router.get('/reparacion', getReparaciones); 
router.get('/reparacion/:id', getReparacionById); 
router.post('/reparacion', createReparacion); 
router.put('/reparacion/:id', updateReparacion); 
router.delete('/reparacion/:id', deleteReparacion); 

// CRUD DE RUTA
router.get('/ruta', getRutas);
router.get('/ruta/:id', getRutaById);
router.post('/ruta', createRuta);
router.put('/ruta/:id', updateRuta);
router.delete('/ruta/:id', deleteRuta);

///// RUTA LOGIN
router.post('/login', login);

export default router;