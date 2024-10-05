import multer from 'multer';

// Configuración de multer para subir imágenes a 'uploadsMaterial'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadsMaterial'); // Directorio de almacenamiento
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Guarda con nombre único
    }
});

// Configuración de multer con límite de 10MB por archivo
const uploadMaterial = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Límite de 10MB
});

export default uploadMaterial;