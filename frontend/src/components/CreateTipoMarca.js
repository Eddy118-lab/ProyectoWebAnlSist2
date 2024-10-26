import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_TIPO_MARCA = 'http://localhost:8000/api/tipo-marca'; // Cambia la URL a tipo-marca

const CompCreateTipoMarca = () => {
    const [nombre, setNombre] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTipoMarca = {
            nombre
        };

        try {
            const response = await axios.post(URI_TIPO_MARCA, newTipoMarca);
            if (response.status === 201) {
                setSuccessMessage("Tipo de marca creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/vehiculo/tipo-marca/gestion-tipos-marcas'); // Redirigir a la gestión de tipos de marcas
                }, 2000);
            } else {
                setErrorMessage("Error al crear el tipo de marca.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el tipo de marca.");
        }
    };

    const handleCancel = () => {
        navigate('/vehiculo/tipo-marca/gestion-tipos-marcas'); // Redirigir a la gestión de tipos de marcas
    };

    return (
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="card-header text-center">
                    <h2>Crear Tipo de Marca</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
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

                        <div className="d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">
                                Guardar
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateTipoMarca;

