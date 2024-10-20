import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const URI_TIPO_ESTADO = 'http://localhost:8000/api/tipo-estado/';

const CompEditTipoEstado = () => {
    const { id } = useParams(); // Obtener el ID de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getTipoEstadoById();
    }, []);

    const getTipoEstadoById = async () => {
        try {
            const response = await axios.get(`${URI_TIPO_ESTADO}${id}`);
            setDescripcion(response.data.descripcion);
        } catch (error) {
            console.error('Error al obtener el tipo de estado:', error);
            setError('Error al cargar el tipo de estado.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${URI_TIPO_ESTADO}${id}`, { descripcion });
            navigate('/asignacion/tipo-estado/gestion-tipos-estados'); // Redirigir al listado después de editar
        } catch (error) {
            console.error('Error al actualizar el tipo de estado:', error);
            setError('Error al actualizar el tipo de estado.');
        }
    };

    return (
        <div className="container mt-5" style={{ marginTop: '120px' }}> {/* Aumentar margen superior */}
            <h2 className="text-center mb-4">Editar Tipo de Estado</h2>

            {error && <p className="text-danger">{error}</p>}
            {loading ? (
                <p className="text-center">Cargando...</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">ID</label>
                        <input
                            type="text"
                            className="form-control"
                            value={id} // Mostrar el ID pero bloquear el campo
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    {/* Botones en una fila separada */}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/asignacion/tipo-estado/gestion-tipos-estados')}>
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CompEditTipoEstado;
