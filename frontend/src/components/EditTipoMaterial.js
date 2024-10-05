import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI = 'http://localhost:8000/api/tipo-material'; // Reemplaza con la URL correcta de tu API

const CompCreateTipoMaterial = () => {
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(URI, { descripcion });
            navigate('/material/tipo-material/gestion-tipos-materiales'); // Redirigir al listado después de crear
        } catch (error) {
            console.error('Error al crear el tipo de material:', error);
            setError('Error al crear el tipo de material');
        }
    };

    return (
        <div className="container">
            <h2 className="text-center">Crear Tipo de Material</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="descripcion">Descripción</label>
                    <input
                        type="text"
                        id="descripcion"
                        className="form-control"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success">Crear</button>
                <button type="button" className="btn btn-secondary ml-2" onClick={() => navigate('/material/tipo-material/gestion-tipos-materiales')}>
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default CompCreateTipoMaterial;
