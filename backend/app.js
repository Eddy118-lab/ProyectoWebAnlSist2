import express from "express";
import cors from 'cors';
import db from "./database/db.js";
import mainRoutes from './routes/routes.js';

const app = express();
app.use(cors());
app.use(express.json());

// Definir las rutas
app.use('/api', mainRoutes);

db.authenticate()
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch((error) => console.log(`Error de conexión: ${error}`));

app.listen(8000, () => {
    console.log('El servidor está corriendo en http://localhost:8000/');
});
