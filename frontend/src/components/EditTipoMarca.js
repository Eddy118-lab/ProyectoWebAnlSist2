import axios from 'axios';
import { useState, useEffect, useCallback } from 'react'; // Importar useCallback
import { useNavigate, useParams } from 'react-router-dom';

const URI_TIPO_MARCA = 'http://localhost:8000/api/tipo-marca/'; // Cambia la URL a la de tipo-marca

const CompEditTipoMarca = () => {
    const { id } = useParams(); // Obtener el ID de los parámetros de la URL
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getTipoMarcaById = useCallback(async () => {
        try {
            const response = await axios.get(`${URI_TIPO_MARCA}${id}`);
            setNombre(response.data.nombre);
        } catch (error) {
            console.error('Error al obtener el tipo de marca:', error);
            setError('Error al cargar el tipo de marca.');
        } finally {
            setLoading(false);
        }
    }, [id]); // Incluir id como dependencia

    useEffect(() => {
        getTipoMarcaById();
    }, [getTipoMarcaById]); // Incluir getTipoMarcaById en el array de dependencias

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI_TIPO_MARCA}${id}`, { nombre });
            navigate('/vehiculo/tipo-marca/gestion-tipos-marcas'); // Redirigir al listado después de editar
        } catch (error) {
            console.error('Error al actualizar el tipo de marca:', error);
            setError('Error al actualizar el tipo de marca.');
        }
    };

    return (
        <div className="container mt-5" style={{ marginTop: '120px' }}> {/* Aumentar margen superior */}
            <h2 className="container mt-5 text-center mb-5">Editar Tipo de Marca</h2>

            {error && <p className="text-danger">{error}</p>}
            {loading ? (
                <p className="text-center">Cargando...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    {/* Botones en una fila separada */}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/vehiculo/tipo-marca/gestion-tipos-marcas')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CompEditTipoMarca;
