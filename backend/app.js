import express from "express";
import cors from 'cors';
import db from "./database/db.js";
import mainRoutes from './routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definir las rutas
app.use('/api', mainRoutes);

db.authenticate()
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch((error) => console.log(`Error de conexión: ${error}`));

app.listen(8000, () => {
    console.log('El servidor está corriendo en http://localhost:8000/');
});
