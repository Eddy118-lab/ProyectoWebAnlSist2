import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_PROYECTO = 'http://localhost:8000/api/proyecto/';

const CompEditProyecto = () => {
    const { id } = useParams();  // Obtener el ID del proyecto de los parámetros de la URL
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProyecto = async () => {
            try {
                const res = await axios.get(`${URI_PROYECTO}${id}`);
                const proyecto = res.data;
                setNombre(proyecto.nombre);
                setDescripcion(proyecto.descripcion);
                setEstado(proyecto.estado);
            } catch (error) {
                console.error("Error al obtener el proyecto:", error);
                setErrorMessage("Error al obtener el proyecto.");
            }
        };

        fetchProyecto();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedProyecto = {
            nombre,
            descripcion,
            estado
        };

        try {
            const response = await axios.put(`${URI_PROYECTO}${id}`, updatedProyecto);
            if (response.status === 200) {
                setSuccessMessage("Proyecto actualizado con éxito!");
                setTimeout(() => {
                    navigate('/proyecto/gestion-proyectos');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el proyecto.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el proyecto.");
        }
    };

    const handleCancel = () => {
        navigate('/proyecto/gestion-proyectos');
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '800px' }}>
                <div className="card-header text-center">
                    <h2>Editar Proyecto</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nombre</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Estado</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12">
                            <button type='submit' className='btn btn-primary me-2'>Actualizar</button>
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditProyecto;
