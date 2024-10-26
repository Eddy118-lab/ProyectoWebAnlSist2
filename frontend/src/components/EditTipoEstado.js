import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_TIPO_ESTADO = 'http://localhost:8000/api/tipo-estado/';

const CompEditTipoEstado = () => {
    const { id } = useParams(); // Obtener el ID de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipoEstado = async () => {
            try {
                const response = await axios.get(`${URI_TIPO_ESTADO}${id}`);
                const tipoEstado = response.data;
                setDescripcion(tipoEstado.descripcion);
            } catch (error) {
                console.error('Error al obtener el tipo de estado:', error);
                setErrorMessage('Error al cargar el tipo de estado.');
            }
        };

        fetchTipoEstado();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTipoEstado = {
            descripcion,
        };

        try {
            const response = await axios.put(`${URI_TIPO_ESTADO}${id}`, updatedTipoEstado);
            if (response.status === 200) {
                setSuccessMessage("Tipo de estado actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/asignacion/tipo-estado/gestion-tipos-estados');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el tipo de estado.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el tipo de estado.");
        }
    };

    const handleCancel = () => {
        navigate('/asignacion/tipo-estado/gestion-tipos-estados');
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <div className="card-header text-center">
                    <h2>Editar Tipo de Estado</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Descripción</label>
                            <input
                                type='text'
                                className='form-control'
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type='submit' className='btn btn-primary'>Guardar</button>
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditTipoEstado;
